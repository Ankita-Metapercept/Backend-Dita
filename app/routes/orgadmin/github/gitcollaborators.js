const express = require('express')
const gitauth = require('../../../controllers/orgadmin/github/gitcollaborators')
const router = express.Router()

router.post('/orgadmin/github/gitcollaborators', gitauth.addGitCollaborators)
router.get('/orgadmin/github/gitcollaborators', gitauth.getGitCollaborators)

module.exports = router