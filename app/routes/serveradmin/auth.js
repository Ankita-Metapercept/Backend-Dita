const express = require('express')
const AppAuth = require('../../controllers/serveradmin/auth.js')
const router = express.Router()

router.post('/serveradmin/authenticate', AppAuth.authenticate)
router.post('/serveradmin/register', AppAuth.register)

module.exports = router