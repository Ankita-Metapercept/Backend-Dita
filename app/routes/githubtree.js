const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/:repoUser/:repoName/branch/:branchName/sha', (req,res)=> {
    var gitToken = req.header('gitToken')
    var repo_user = req.params.repoUser
    var repo_name = req.params.repoName
    var branch_name = req.params.branchName
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${repo_user}/${repo_name}/git/refs/heads/${branch_name}`,
      headers: {
        Authorization: 'token ' + gitToken
      }
    }).then((response) => {
      res.json(response.data)
    }).catch((err)=> {
      res.send(err)
    })
  })

  router.get('/:repoUser/:repoName/head/sha', (req,res)=> {
    var gitToken = req.header('gitToken')
    var repo_user = req.params.repoUser
    var repo_name = req.params.repoName
    var branch_name = req.params.branchName
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${repo_user}/${repo_name}/git/refs/heads`,
      headers: {
        Authorization: 'token ' + gitToken
      }
    }).then((response) => {
      res.json(response.data)
    }).catch((err)=> {
      res.send(err)
    })
  })

router.get('/:repoUser/:repoName/sha/:sha/tree', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var sha = req.params.sha
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/git/trees/${sha}`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/:repoUser/:repoName/sha/:sha/content', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var sha = req.params.sha
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/git/blobs/${sha}`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

module.exports = router