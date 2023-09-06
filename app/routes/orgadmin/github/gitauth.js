const express = require('express')
const gitauth = require('../../../controllers/orgadmin/github/gitauth.js')
const router = express.Router()

router.get('/orgadmin/github/callback', gitauth.gitAuthCallback)
router.get('/orgadmin/success', gitauth.gitAuthSuccess)
router.patch('/orgadmin/gitauth/resettoken', gitauth.gitResetToken)
router.get('/github', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

module.exports = router