const db = require("../../config/db");
const shell = require("shelljs");
const dirTree = require("directory-tree");
const fs = require("fs");
const fsExtra = require("fs-extra");
const extract = require("extract-zip");
const _ = require("lodash");
const axios = require("axios");
const { readdir } = require("fs/promises");
const path = require("path");
const Organization = db.organization;
const Project = db.project;
const ProjectUser = db.projectUser;
const UserWorkspace = db.orgUserWorkspace;
const DitaotVersion = db.ditaotVersion;
const githubAuthToken = db.githubAuthToken;

module.exports = {
  addWorkspace,
  getWorkspaceByUserId,
  getRepoTree,
  getFileContent,
  saveFileContent,
  commitChanges,
  getRepoList,
  getInputFiles,
  syncWorkspace,
};
// Add workspace details
async function addWorkspace(orgId, workspaceParams) {
  try {
    let organizationData = await Organization.findOne({ _id: orgId });
    let res = await ProjectUser.find({ userId: workspaceParams.userId });
    let ditaotData = await DitaotVersion.findOne({
      versionLabel: organizationData.ditaotVersion,
    });
    workspaceParams.installedPath =
      workspaceParams.installedPath + `/${workspaceParams.userId}`;
    const userGitTokenDetails = await githubAuthToken.findOne({
      userId: workspaceParams.userId,
    });
    await shell.mkdir("-p", workspaceParams.installedPath);
    const workspace = new UserWorkspace(workspaceParams);
    await workspace.save();
    let projectData = await Project.find({ orgId });
    let userProjects = [];
    res.forEach(async (element) => {
      let projectArr = _.filter(projectData, (e) => {
        return e.id === element.projectId;
      });
      if (projectArr.length !== 0) {
        projectArr.forEach((pdata) => {
          userProjects.push(pdata);
        });
      }
    });
    userProjects.forEach(async (element) => {
      if (!shell.which("git")) {
        shell.echo("Sorry, this script requires git");
        shell.exit(1);
        return res.status(400).send("Not supported");
      }
      shell.cd(workspaceParams.installedPath);
      await shell.exec(
        `git clone https://${res[0].githubUsername}:${userGitTokenDetails.token}@github.com/${element.owner}/${element.projectName}.git`,
        function (code, stdout, stderr) {
          console.log("Exit code:", code);
          console.log("Program output:", stdout);
          console.log("Program stderr:", stderr);
          if (code === 0) return "Success";
          else return "Issue with clone";
        }
      );
    });
    await downloadZipFile(
      ditaotData.ditaotURL,
      workspaceParams.installedPath +
        "/" +
        "dita-ot-" +
        ditaotData.versionLabel +
        ".zip"
    );
    await extract(
      workspaceParams.installedPath +
        "/" +
        "dita-ot-" +
        ditaotData.versionLabel +
        ".zip",
      { dir: workspaceParams.installedPath }
    );
    console.log("Extraction complete");
    await fs.unlink(
      workspaceParams.installedPath +
        "/" +
        "dita-ot-" +
        ditaotData.versionLabel +
        ".zip",
      (err) => {
        if (err) {
          throw err;
        }
        console.log("Delete File successfully.");
      }
    );
    return { Message: "workspace created" };
  } catch (err) {
    throw err;
  }
}
const downloadZipFile = async (url, filePath) => {
  const response = await axios({
    method: "get",
    url,
    responseType: "stream",
    headers: {
      Accept: "application/octet-stream",
    },
  });
  return new Promise((resolve, reject) => {
    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let progress = 0;
    response.data
      .on("end", () => {
        console.log("Done downloading file.");
        resolve(filePath);
      })
      .on("error", (err) => {
        console.error("Error downloading file.");
        reject(err);
      })
      .on("data", (d) => {
        progress += d.length;
        console.log(`Downloaded ${progress} bytes`);
      })
      .pipe(dest);
  });
};
// Get workspace details by user Id
async function getWorkspaceByUserId(userId) {
  try {
    return await UserWorkspace.findOne({ userId: userId });
  } catch (err) {
    return err;
  }
}
// Get workspace project tree object
async function getRepoTree(path) {
  try {
    let tree = dirTree(path);
    return tree;
  } catch (err) {
    return err;
  }
}
// Get workspace file content
async function getFileContent(path) {
  try {
    const buffer = fs.readFileSync(path);
    const fileContent = buffer.toString();
    return fileContent;
  } catch (err) {
    return err;
  }
}
// Save file content inside workspace
async function saveFileContent(path, content) {
  try {
    fs.writeFileSync(path, content, "utf8");
    return { message: "The file was saved!" };
  } catch (err) {
    return err;
  }
}
// Coomit all chages on github
async function commitChanges(params) {
  try {
    const { path, message, githubUsername, email } = params;
    shell.cd(path);
    shell.exec(`git config --global user.name ${githubUsername}`, {
      silent: true,
    });
    shell.exec(`git config --global user.email ${email}`, {
      silent: true,
    });
    const commitCommands = [
      "git pull",
      "git config --global core.longpaths true",
      "git add .",
      `git commit -m "${message}"`,
      "git push",
    ];
    for (let command of commitCommands) {
      const result = shell.exec(command, {
        silent: true,
      });
      if (result.code !== 0) {
        if (command === "git pull") {
          if (result.stderr.includes("Automatic merge failed")) {
            throw "There were conflicts while syncing your project from the current code on github. Please resolve those issues in any code editor and try pushing your changes again. If the issue still exists please reach out to us at support@ditaxpresso.com. Thank you for your understanding.";
          }
          continue;
        }
        if (
          result.stdout.includes("Your branch is ahead") ||
          result.stderr.includes("Your branch is ahead")
        ) {
          const res = shell.exec("git push", { silent: true });
          if (res.code === 0) {
            return { message: "Files committed successfully!" };
          }
          if (res.stderr.includes("Repository not found")) {
            throw "The account you are using in Git Bash is either not a collaborator in this repository or the repository no longer exists. For more details or assistance, please contact us at support@ditaxpresso.com.";
          }
          if (result.stderr) {
            throw result.stderr;
          }
          return { message: result.stdout };
        }
        if (result.stderr.includes("Repository not found")) {
          throw "The account you are using in Git Bash is either not a collaborator in this repository or the repository no longer exists. For more details or assistance, please contact us at support@ditaxpresso.com.";
        }
        if (result.stderr) {
          throw result.stderr;
        }
        return { message: result.stdout };
      }
    }
    return { message: "Files committed successfully!" };
  } catch (err) {
    throw err;
  }
}
// get all repository list from workspace
async function getRepoList(userId, path) {
  try {
    let res = await ProjectUser.find({ userId: userId });
    let projectData = await Project.find();
    let userProjects = [];
    res.forEach(async (element) => {
      let projectArr = _.filter(projectData, (e) => {
        return e.id === element.projectId;
      });
      if (projectArr.length !== 0) {
        projectArr.forEach((pdata) => {
          userProjects.push(pdata);
        });
      }
    });
    const files = fs.readdirSync(path, { withFileTypes: true });
    const directoriesInDIrectory = files
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    let fdata = [];
    for await (uproject of userProjects) {
      fdata.push(
        _.filter(directoriesInDIrectory, (e) => {
          return e === uproject.projectName;
        })[0]
      );
    }
    return fdata;
  } catch (err) {
    return err;
  }
}
async function getInputFiles(dir, ext) {
  try {
    const matchedFiles = [];
    const files = await readdir(dir);
    for (const file of files) {
      const fileExt1 = path.extname(file);
      if (fileExt1) {
        if (fileExt1 === `.${ext}`) {
          matchedFiles.push({ fileName: file, path: dir + "/" + file });
        }
      } else {
        let dir1 = dir + "/" + file;
        const files = await readdir(dir1);

        for (const file of files) {
          const fileExt2 = path.extname(file);
          if (fileExt2) {
            if (fileExt2 === `.${ext}`) {
              matchedFiles.push({ fileName: file, path: dir1 + "/" + file });
            }
          }
        }
      }
    }
    return matchedFiles;
  } catch (err) {
    return err;
  }
}
// sync workspace from github
async function syncWorkspace(req) {
  try {
    const { orgId, userId, githubUsername, gitToken } = req.body;
    const workspaceData = await UserWorkspace.findOne({ orgId, userId });
    const res = await ProjectUser.find({ userId });
    const projectData = await Project.find({ orgId });
    if (!workspaceData || !res || !projectData) {
      throw "Invalid details provided";
    }
    const userProjects = [];
    res.forEach(async (element) => {
      let isRepoDeleted = true;
      const projectArr = _.filter(projectData, (e) => {
        if (e.id === element.projectId) {
          isRepoDeleted = false;
          return e.id === element.projectId;
        }
      });
      // if repo deleted on client admin github
      if (isRepoDeleted) {
        element._doc.isActive = false;
        userProjects.push(element);
        await ProjectUser.deleteOne({ _id: element._id });
      }
      if (projectArr.length !== 0) {
        projectArr.forEach((pdata) => {
          pdata.isActive = element.isActive;
          userProjects.push(pdata);
        });
      }
    });
    const syncedProjects = [];
    const dirent = fs.readdirSync(workspaceData.installedPath);
    for (let projectDetails of userProjects) {
      if (!projectDetails.isActive) {
        fsExtra.removeSync(
          workspaceData.installedPath + "/" + projectDetails.projectName
        );
        continue;
      }
      if (!dirent.includes(projectDetails.projectName)) {
        if (!shell.which("git")) {
          shell.echo("Sorry, this script requires git");
          shell.exit(1);
        }
        shell.cd(workspaceData.installedPath);
        shell.exec("git config --global core.longpaths true", {
          silent: true,
        });
        const result = shell.exec(
          `git clone https://${githubUsername}:${gitToken}@github.com/${projectDetails.owner}/${projectDetails.projectName}.git`,
          {
            silent: false,
          }
        );
        if (result.code !== 0) {
          throw "Issue while clone." + result.stderr;
        }
        syncedProjects.push(projectDetails);
      }
    }
    return { message: "Workspace sync successful!", syncedProjects };
  } catch (error) {
    throw error;
  }
}
