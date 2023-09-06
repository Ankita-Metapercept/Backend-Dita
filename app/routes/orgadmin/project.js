const express = require('express')
const orgAdminController = require('../../controllers/orgadmin/project.js')
const jwt = require('../../config/orgadmin/jwt');
const router = express.Router()
router.use(jwt());

router.get('/orgadmin/project', orgAdminController.getOrgProjectList);
router.get('/orgadmin/github/projectfilecount', orgAdminController.getProjectFileCount)

module.exports = router