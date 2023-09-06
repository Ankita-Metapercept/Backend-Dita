const express = require('express')
const jwt = require('../../../config/orgadmin/jwt');
const orgUserController = require('../../../controllers/orguser/docpublisher/docpublish')
const router = express.Router()
router.use(jwt());

router.post('/orguser/docpublish', orgUserController.docPublish);

module.exports = router