const {Router} = require('express')
const router = Router()
const doceditorController = require("../../../controllers/orguser/doceditor/doceditor.js")
const uploadMiddleware = require('../../../config/middlewares/createmulterstorage.js');

router.post("/orguser/doceditor/generateNodeId",doceditorController.generateNodeId)
router.post('/orguser/doceditor/editXml', doceditorController.editXml);
router.post('/orguser/doceditor/uploadDitaContentImg',uploadMiddleware.single("ditaContentImages"),doceditorController.uploadDitaContentImg)

module.exports = router