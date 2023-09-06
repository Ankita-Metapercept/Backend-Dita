const express = require('express')
const gitauth = require('../../../controllers/orguser/github/gitauth.js')
const router = express.Router()

router.get('/orguser/github/callback', gitauth.gitAuthCallback)
router.get('/orguser/github/success', gitauth.gitAuthSuccess)
router.patch('/orguser/gitauth/resettoken', gitauth.gitResetToken)

module.exports = router