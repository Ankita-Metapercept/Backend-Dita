const express = require('express')
const axios = require('axios')
const router = express.Router()

  router.post('/:repoUser/:repoName/repoRelease', (req,res)=> {
    var gitToken = req.header('gitToken')
    var repo_user = req.params.repoUser
    var repo_name = req.params.repoName
    axios({
      method: 'post',
      url: `https://api.github.com/repos/${repo_user}/${repo_name}/releases`,
      headers: {
        Authorization: 'token ' + gitToken
      },
      data: req.body
    }).then((response) => {
      res.json(response.data)
    }).catch((err)=> {
      res.send(err)
    })
  })

module.exports = router