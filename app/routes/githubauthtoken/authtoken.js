const express = require('express')
const jwt = require('../../config/orgadmin/jwt');
var githubAuthTokenController = require('../../controllers/githubauthtoken/authtoken')
const router = express.Router()
router.use(jwt());

router.post('/github/authtoken', githubAuthTokenController.addGithubToken)
router.put('/github/authtoken', githubAuthTokenController.updateGithubToken)
router.get('/github/authtoken/byuserid', githubAuthTokenController.getGithubTokenById)
router.get('/github/authtoken', githubAuthTokenController.getGithubToken)

module.exports = router