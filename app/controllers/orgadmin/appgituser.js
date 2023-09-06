const adminService = require('../../services/orgadmin/appgituser');
const express = require('express');
const app = express()
exports.getUser = function(req, res, next) {
    adminService.getUser(req.params.projectID)
        .then((user) => res.send(user))
        .catch(err => next(err))
}
exports.getUserById = function(req, res, next) {
    adminService.getUserById(req.params.projectID, req.params.userID)
        .then((user) => res.send(user))
        .catch(err => next(err))
}
exports.addUser = function(req, res, next) {
    adminService.addUser(req.body)
        .then(() => res.json({ message: 'User added successfully' }))
        .catch(err => next(err));
}
exports.updateUser = function(req, res, next) {
    adminService.updateUser(req.body)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.newUserNotification = function(req, res, next) {
    let repoUser = req.params.repoUser
    let repoName = req.params.repoName
    let projectId = req.params.projectId
    let gitToken = req.header('gitToken')
    adminService.newUserNotification(repoUser, repoName, gitToken, projectId)
        .then((user) => res.send(user))
        .catch(err => next(err));
}
exports.sendMailToUser = function(req, res, next) {
    let to_email = req.body.to_email
    let subject = req.body.subject
    let email_body = req.body.email_body
    adminService.sendMailToUser(to_email, subject, email_body)
        .then(() => res.send({ "message": "Email sent" }))
        .catch(err => next(err));
}