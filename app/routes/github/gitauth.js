const express = require('express')
const axios = require('axios')
const router = express.Router()
const gitauth = require('../../controllers/github/gitauth.js')

const app = express()


// var access_token = "";
router.get('/github/callback', gitauth.gitAuthCallback)
router.get('/success', gitauth.gitAuthSuccess)

// const clientID = '7858968fbfedce596988'
// const clientSecret = '40f1df458c680ccd17baf7bc4d53c92680e7cfad'


// router.get('/github/callback', (req, res) => {
//   const requestToken = req.query.code
  
//   axios({
//     method: 'post',
//     url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
//     scope: ["repo"],
//     headers: {
//          accept: 'application/json'
//     }
//   }).then((response) => {
//     access_token = response.data.access_token
//     res.redirect('http://localhost:8080/github');
//   }).catch((err)=> {
//     console.log(err)
//   })
// })

// router.get('/success', function(req, res) {
//   axios({
//     method: 'get',
//     url: `https://api.github.com/user`,
//     headers: {
//       Authorization: 'token ' + access_token
//     }
//   }).then((response) => {
//     var resObj = {
//       userData: response.data,
//       access_token: access_token
//     }
//     access_token = ""
//     res.json(resObj)
//   }).catch((err)=> {
//     console.log(err)
//   })
// });


router.get('/github', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

module.exports = router