const gitRepo = require('../../../services/orguser/github/gitrepo.js')
const express = require('express')
exports.repoList = function(req, res, next) {
    let gitToken = req.header('gitToken')
    gitRepo.repoList(gitToken)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoDetails = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    gitRepo.repoDetails(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoBranch = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    gitRepo.repoBranch(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoContent = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let reqBody = req.body
    gitRepo.repoContent(gitToken, reqBody)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.getRepoContent = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    let repoPath = req.query.repoPath
    let repoBranch = req.query.repoBranch 
    gitRepo.getRepoContent(gitToken, repoUser, repoName, repoBranch, repoPath)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.getBranchCommitNotification = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    let repoBranch = req.query.repoBranch 
    gitRepo.getBranchCommitNotification(gitToken, repoUser, repoName, repoBranch)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.get24hrsCommitsNotification = function(req,res,next){
    const gitToken = req.header("gitToken");
    const userProjects = req.query.userId
    gitRepo
      .get24hrsCommitsNotification(gitToken, userProjects)
      .then((data) => res.status(200).send(data))
      .catch((err) => next(err));
}