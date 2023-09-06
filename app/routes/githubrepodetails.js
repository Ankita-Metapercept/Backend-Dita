const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/:repoUser/:repoName/repoContent', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var repo_path = req.body.repopath
  var encodedData = Buffer.from(req.body.message).toString('base64')
  var dataObj = {}
  if(req.body.branch){
    dataObj = {
      message: req.body.message,
      content: encodedData,
      branch: req.body.branch
    }
  }
  else{
    dataObj = {
      message: req.body.message,
      content: encodedData
    }
  }
  axios({
    method: 'put',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/contents/${repo_path}`,
    headers: {
      Authorization: 'token ' + gitToken
    },
    data: dataObj
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.put('/:repoUser/:repoName/repoContent', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var repo_path = req.body.repopath
  var repo_sha = req.body.sha
  var encodedData = Buffer.from(req.body.content).toString('base64')
  var dataObj = {}
  if(req.body.branch){
    dataObj = {
      message: req.body.message,
      content: encodedData,
      branch: req.body.branch,
      sha: repo_sha
    }
  }
  else{
    dataObj = {
      message: req.body.message,
      content: encodedData,
      sha: repo_sha
    }
  }
  axios({
    method: 'put',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/contents/${repo_path}`,
    headers: {
      Authorization: 'token ' + gitToken
    },
    data: dataObj
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/:repoUser/:repoName/repoSHA', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var repo_path = req.header('repopath')
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/contents/${repo_path}`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/:repoUser/:repoName/branch/:branchName/repoSHA', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var repo_path = req.header('repopath')
  var branch_name = req.params.branchName
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/contents/${repo_path}?ref=${branch_name}`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/:repoUser/:repoName/branch/:branchName/repoContent', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  var repo_path = req.header('repopath')
  var branch_name = req.params.branchName
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/contents/${repo_path}?ref=${branch_name}`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/getUserEmail', (req,res)=> {
  var gitToken = req.header('gitToken')
  axios({
    method: 'get',
    url: `https://api.github.com/user/emails`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.get('/:repoUser/getUserEmail', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  axios({
    method: 'get',
    url: `https://api.github.com/users/${repo_user}`,
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