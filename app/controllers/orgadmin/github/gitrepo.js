const gitRepo = require('../../../services/orgadmin/github/gitrepo.js')
const express = require('express')
exports.repoList = function(req, res, next) {
    gitRepo.repoList(req.header('gitToken'))
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
exports.repoCollaborators = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    gitRepo.repoCollaborators(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoCommits = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    gitRepo.repoCommits(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoBranchCommits = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    let branchName = req.query.branchName
    gitRepo.repoBranchCommits(gitToken, repoUser, repoName, branchName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoRelease = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    gitRepo.repoRelease(gitToken, repoUser, repoName)
        .then(user => res.json(user))
        .catch(err => next(err))
}
exports.repoCreateRelease = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let repoUser = req.query.repoUser
    let repoName = req.query.repoName
    let tag_name = req.body.tag_name
    let target_commitish = req.body.target_commitish
    let name = req.body.name
    let body = req.body.body
    let draft = req.body.draft
    let prerelease = req.body.prerelease
    let generate_release_notes = req.body.generate_release_notes
    gitRepo.repoCreateRelease(gitToken, repoUser, repoName, tag_name, target_commitish, name, body, draft, prerelease, generate_release_notes)
        .then(release => res.json(release))
        .catch(err => next(err))
}