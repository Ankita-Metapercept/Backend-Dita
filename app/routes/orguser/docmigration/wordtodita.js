const express = require("express");
const router = express.Router();
const wordToDitaController = require("../../../controllers/orguser/docmigration/wordtodita.js");
const uploadMiddleware = require("../../../config/middlewares/createmulterstorage.js");

router.post(
  "/orguser/wordToDita/uploadWordFileExtracts",
  uploadMiddleware.single("wordFile"),
  wordToDitaController.uploadExtractsToWorkspace
);
router.post("/orguser/wordToDita/convertToDita",wordToDitaController.convertToDita)
router.get("/orguser/wordToDita/downloadDitazip",wordToDitaController.downloadDitazip)
router.post("/orguser/wordToDita/commitDitaFiles",wordToDitaController.commitDitaFiles)
router.get("/orguser/wordToDita/syncedprojects",wordToDitaController.getSyncedProjects)

module.exports = router;
