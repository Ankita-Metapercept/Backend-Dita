const multer = require("multer");
const db = require("../db");
const {orgUserWorkspace,organization} = db;
const shell = require("shelljs")

// storage configurations for multer
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const workspacePath = await getUploadPath(req,file)
      await shell.mkdir('-p', workspacePath)
      return cb(null, workspacePath);
    } catch (error) {
      cb(error)
    }
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});
// middleware for uploading word file
const uploadMiddleware = multer({ storage });

// function for getting upload path
async function getUploadPath(req,file) {
  try {
    const { orgId, userId, projectName } = req.query;
    const workspaceData = await orgUserWorkspace.findOne({ orgId, userId });
    const organizationDetails = await organization.findOne({_id:orgId})
    if (workspaceData) {
      // choosing which path will be used for uploading file based on request type
      switch(file.fieldname){
        case "wordFile":
          return workspaceData.installedPath + `/word-files`;
        case "pdfCoverLogo":
          return workspaceData.installedPath + `/dita-ot-${organizationDetails.ditaotVersion}/plugins/org.dita.pdf2/cfg/common/artwork`
        case "HtmlLogo":
          return workspaceData.installedPath +'/Logo'
        case "ditaContentImages":
          return workspaceData.installedPath + `/${projectName}/images`
        default:
          return workspaceData.installedPath;
      }
    }
    throw "Invalid user details or no user exists with given details"
  } catch (error) {
    throw error;
  }
}
module.exports = uploadMiddleware;
