const gitRepo = require('../../services/github/gitrepo.js')
const express = require('express')
// const jwt = require('../config/jwt')

const app = express()

// app.use(jwt());

exports.repoList = function(req, res, next) {
    gitRepo.repoList(req.header('gitToken'))
        .then(user => res.json(user))
        .catch(err => next(err))
}

exports.repoDetails = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    gitRepo.repoDetails(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}

exports.repoBranch = function(req, res, next) {
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    gitRepo.repoBranch(req.header('gitToken'), repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}

exports.repoCollaborators = function(req, res, next) {
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    gitRepo.repoCollaborators(req.header('gitToken'), repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}

exports.repoCommits = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    gitRepo.repoCommits(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}

exports.repoBranchCommits = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    let branchName = req.params.branchName
    gitRepo.repoBranchCommits(gitToken, repoUser, repoName, branchName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
