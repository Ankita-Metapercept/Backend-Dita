const express = require('express')
const axios = require('axios')
const router = express.Router()
const db = require('../config/db');
const User = db.githubtrepoevent;

router.post('/githubrepoevet/register', async(req, res)=> {
    var userParam = req.body
    const user = new User(userParam);
    await user.save();
});

router.get('/:repoUser/:repoName/githubrepoevet', async(req, res)=> {

  User.findOne({ repopath: req.params.repoUser+"/"+req.params.repoName }).then((nres)=> {
    res.send(nres)
  }).catch((nerr)=> {
    res.send(nerr)
  })
});

router.get('/:repoUser/:repoName/repoEvent', (req,res)=> {
  var gitToken = req.header('gitToken')
  var repo_user = req.params.repoUser
  var repo_name = req.params.repoName
  axios({
    method: 'get',
    url: `https://api.github.com/repos/${repo_user}/${repo_name}/events`,
    headers: {
      Authorization: 'token ' + gitToken
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((err)=> {
    res.send(err)
  })
})

router.put('/githubrepoevet/update', (req, res)=> {
  User.updateOne(
      { repopath: req.body.repopath },
      { $addToSet: { eventData: [req.body.eventData] } },
    ).then((newres)=> {
      res.send(newres)
    }).catch((err)=> {
      res.send(err)
    })
});

module.exports = router