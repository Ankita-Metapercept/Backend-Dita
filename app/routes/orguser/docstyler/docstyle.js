const {Router} = require('express')
const router = Router()
const docstylerController = require("../../../controllers/orguser/docstyler/docstyler.js");
const uploadMiddleware = require('../../../config/middlewares/createmulterstorage.js');

router.post('/orguser/docstyler/customizePdfOutput', docstylerController.customizePdfOutput);
router.post('/orguser/docstyler/customizeHtmlOutput', docstylerController.customizeHtmlOutput)
router.post('/orguser/docstyler/uploadPdfLogo',uploadMiddleware.single("pdfCoverLogo"),docstylerController.uploadPdfLogo)
router.post('/orguser/docstyler/uploadHtmlLogo',uploadMiddleware.single("HtmlLogo"),docstylerController.uploadHtmlLogo)

module.exports = router