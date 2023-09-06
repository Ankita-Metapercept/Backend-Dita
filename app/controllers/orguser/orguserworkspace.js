const orgUserService = require('../../services/orguser/orguserworkspace');
const express = require('express');
exports.addWorkspace = function(req, res, next) {
    let orgId = req.query.orgId
    orgUserService.addWorkspace(orgId, req.body)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.getWorkspaceByUserId = function(req, res, next) {
    let userId = req.query.userId
    orgUserService.getWorkspaceByUserId(userId)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.getRepoTree = function(req, res, next) {
    let path = req.query.path
    orgUserService.getRepoTree(path)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.getFileContent = function(req, res, next) {
    let path = req.query.path
    orgUserService.getFileContent(path)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.saveFileContent = function(req, res, next) {
    let path = req.body.path
    let content = req.body.content
    orgUserService.saveFileContent(path, content)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.commitChanges = function(req, res, next) {
    orgUserService.commitChanges(req.body)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.getRepoList = function(req, res, next) {
    let path = req.query.path
    let userId = req.query.userId
    orgUserService.getRepoList(userId, path)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.getInputFiles = function(req, res, next) {
    let path = req.query.path
    let extenssion = req.query.extenssion
    orgUserService.getInputFiles(path, extenssion)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.syncWorkspace = function (req,res,next){
    orgUserService
      .syncWorkspace(req)
      .then((result) => res.send(result))
      .catch((err) => next(err));
}