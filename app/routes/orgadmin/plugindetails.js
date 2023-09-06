const express = require('express')
const orgAdminController = require('../../controllers/orgadmin/plugindetails.js')
const router = express.Router()
router.post('/plugins', orgAdminController.addDetails);
router.get('/plugins', orgAdminController.getDetails);
module.exports = router