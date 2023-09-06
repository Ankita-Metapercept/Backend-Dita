const docExtractor = require("../../../utilities/orguser/wordtodita/docextractor.js");
const db = require("../../../config/db.js");
const SaxonJS = require("saxon-js");
const fs = require("fs");
const shell = require("shelljs")
const path = require("path");
const { execSync } = require("child_process");
const zip = require("node-zip")();
const {
  findDitamapPathsRecursively,
  migrateToRelativePath,
  addFilesToZip
} = require("../../../utilities/orguser/wordtodita/utilityfunctions.js");
const orgUserWorkspace = db.orgUserWorkspace;
const projectUser=db.projectUser;

module.exports = {
  uploadExtractsToWorkspace,
  convertToDita,
  downloadDitazip,
  commitDitaFiles,
  getSyncedProjects,
};
// function for uploading word file and it's extracts in workspace
async function uploadExtractsToWorkspace(req) {
  try {
    const { orgId, userId } = req.query;
    const { filename: fileName, path: filePath, mimetype } = req.file;
    if(fileName.split(" ").length > 1){
      throw "file name should not contain any space!"
    }
    // generating folder name for given file
    let folderName = fileName.split(".");
    folderName.pop();
    folderName = folderName.join(".");
    let fileType;
    // validation if the provided file is a word file
    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileType = "docx";
    }
    if (userId && orgId && filePath && folderName && fileType) {
      const userWorkspaceDetails = await orgUserWorkspace.findOne({ userId, orgId });
      // creating destination path for the extracts to be saved
      const destinationPath =
      userWorkspaceDetails.installedPath +
        "/word-extracts/" +
        folderName +
        "/extracted-files";
      // extracting file on user workspace
      await docExtractor.open(filePath, destinationPath);
      return { message:"file uploaded successfully!" };
    }
    throw "Invalid file type or data provided!";
  } catch (error) {
    throw error;
  }
}
// word to Dita and Ditamap extractor via xslt
async function convertToDita(req) {
  try {
    const { orgId, userId, folderName } = req.body;
    const userWorkspaceDetails = await orgUserWorkspace.findOne({ userId, orgId });
    if(!userWorkspaceDetails){
      return { message : "invalid user details!" }
    }
    const baseFolderPath = userWorkspaceDetails.installedPath + `/word-extracts/${folderName}/extracted-files`
    const executionSequense = [
      "../../../utilities/orguser/wordtodita/xslfiles/Word2dita1.xsl",
      "../../../utilities/orguser/wordtodita/xslfiles/process.xsl",
      "../../../utilities/orguser/wordtodita/xslfiles/Word2dita2.xsl",
      "../../../utilities/orguser/wordtodita/xslfiles/Word2dita3.xsl",
      "../../../utilities/orguser/wordtodita/xslfiles/Word2dita4.xsl",
      "../../../utilities/orguser/wordtodita/xslfiles/TOC.xsl",
    ];
    const documentContent = fs.readFileSync(
      `${baseFolderPath}/word/document.xml`
    );
    // creating copy of document.xml file for manipulation
    fs.writeFileSync(`${baseFolderPath}/word/transformed.xml`, documentContent);
    for (const xslt of executionSequense) {
      execSync(
        `xslt3 -t -xsl:${path.resolve(
          __dirname,
          xslt
        )} -export:${baseFolderPath}/word/test.sef.json -nogo`,
        {
          stdio: "inherit",
        }
      );
      // transformation result as string after running xslt
      const result = SaxonJS.transform({
        stylesheetFileName: `${baseFolderPath}/word/test.sef.json`,
        sourceFileName: `${baseFolderPath}/word/transformed.xml`,
        destination: "serialized",
      }).principalResult;
      if (
        xslt !== "../../../utilities/orguser/wordtodita/xslfiles/process.xsl" &&
        xslt !== "../../../utilities/orguser/wordtodita/xslfiles/Word2dita4.xsl"
      ) {
        fs.writeFileSync(`${baseFolderPath}/word/transformed.xml`, result);
      }
    }
    //code for converting ditamap href from abosolute to relative
    const baseDirPath =
      baseFolderPath.split("/extracted-files")[0] +
      "/DitaFiles";
    const ditamapFilesPath = [];
    findDitamapPathsRecursively(baseDirPath, ditamapFilesPath);
    //change href value from absolute to relative
    migrateToRelativePath(ditamapFilesPath);
    return {
      message: "your file has been processed!",
      destinationFolderPath: `${baseFolderPath}/DitaFiles`,
    };
  } catch (error) {
    throw error.message;
  }
}
// download dita folder zip
async function downloadDitazip(req,res){
  try {
    const { userId, orgId, folderName } = req.query;
    const userWorkspaceDetails = await orgUserWorkspace.findOne({ userId, orgId });
    if(!userWorkspaceDetails) throw "Invalid user credentials!"
    const processedFilePath = userWorkspaceDetails.installedPath + `/word-extracts/${folderName}/DitaFiles`
    // creating zip file
    const Zip = zip;
    addFilesToZip(Zip, processedFilePath, processedFilePath);
    const data = Zip.generate({ base64: false, compression: "DEFLATE" });
    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", `attachment; filename=${folderName}.zip`);
    return data;
  } catch (error) {
    throw error
  }
}
// commit dita files
async function commitDitaFiles(req){
  try {
    const { orgId, userId, commitFolderName, ditaFolderName, commitMessage } = req.body;
    const workspaceData = await orgUserWorkspace.findOne({orgId,userId})
    if(!workspaceData) throw "Invalid user credentials!"
    const commitPath = workspaceData.installedPath + "/"+ commitFolderName
    shell.mkdir("-p",commitPath)
    const ditaFolderPath = workspaceData.installedPath + "/word-extracts/" + ditaFolderName + "/DitaFiles/*";
    shell.cp("-R", ditaFolderPath, commitPath);
    if (!shell.which("git")) {
      throw "Sorry, this script requires git! Please install git on your system."
    }
    shell.cd(commitPath);
    const commitCommands = [
      "git pull",
      "git config --global core.longpaths true",
      "git add .",
      `git commit -m "${commitMessage}"`,
      "git push",
    ];
    for (let command of commitCommands){
      const result = shell.exec(command, {
        silent: true,
      });
      if (result.code !== 0) {
          if(command === "git pull") {
            if(result.stderr.includes("Automatic merge failed")){
              throw "There were conflicts while syncing your project from the current code on github. Please resolve those issues in any code editor and try pushing your changes again. If the issue still exists please reach out to us at support@ditaxpresso.com. Thank you for your understanding."
            }
            continue
          }
          if(result.stdout.includes("Your branch is ahead") || result.stderr.includes("Your branch is ahead")) {
            const res = shell.exec("git push",{silent:true})
            if(res.code === 0){
               return {message: "Your commit to GitHub was successful! Congratulations!"}
            }
            if(res.stderr.includes("Repository not found")){
               throw "The account you are using in Git Bash is either not a collaborator in this repository or the repository no longer exists. For more details or assistance, please contact us at support@ditaxpresso.com."
            }
            if(result.stderr) {
              throw result.stderr
            }
            return {message:result.stdout} 
          }
          if(result.stderr.includes("Repository not found")){
             throw "The account you are using in Git Bash is either not a collaborator in this repository or the repository no longer exists. For more details or assistance, please contact us at support@ditaxpresso.com."
          }
          if(result.stderr) {
            throw result.stderr
          }
          return {message:result.stdout} 
      }
    }
    return {
      message: "Your commit to GitHub was successful! Congratulations!",
    };
  } catch (error) {
    throw error
  }
}
// get list of synced projects on workspace
async function getSyncedProjects(req){
  try {
    const syncedProjects = []
    const {userId,orgId}= req.query
    const workspaceData = await orgUserWorkspace.findOne({orgId,userId})
    if(!workspaceData) throw "Invalid user credentials provided or no workspace created yet for given user."
    const workspaceFiles = fs.readdirSync(workspaceData.installedPath,{withFileTypes:true})
    const projectUserList = await projectUser.find({userId})
    const projectList = {}
    for(const projectDetails of projectUserList){
      projectList[projectDetails.projectName]=true;
    }
    for (const dirent of workspaceFiles) {
      if (dirent.isDirectory() && projectList[dirent.name]) {
        syncedProjects.push({projectName:dirent.name});
      }
    }
    return syncedProjects
  } catch (error) {
    throw error
  }
}