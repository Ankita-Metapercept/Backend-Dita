const adminService = require('../../services/orguser/user');
const express = require('express');
exports.authenticate = function(req, res, next) {
    adminService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
exports.addOrgUser = function(req, res, next) {
    adminService.addOrgUser(req.body)
        .then(() => res.json({message: "Dummy users created successfully"}))
        .catch(err => next(err));
}
exports.getUserById = function(req, res, next) {
    let userId = req.query.userId
    if(userId){
        adminService.getUserById(userId)
            .then(users => res.json(users))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "userId not found" })
    }
}
exports.getUserGithubCollaboratorId = function(req, res, next) {
    let CollaboratorId = req.query.collaboratorId
    if(CollaboratorId){
        adminService.getUserGithubCollaboratorId(CollaboratorId)
            .then(users => res.json(users))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "collaboratorId not found" })
    }
}
exports.getUsersByOrgId = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        adminService.getUsersByOrgId(orgId)
            .then(users => res.json(users))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.updateOrgUser = function(req, res, next) {
    let userId = req.query.userId
    if(userId){
        adminService.updateOrgUser(userId, req.body)
            .then((resdata) => res.send(resdata))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "userId not found" })
    }
}
exports.orgUserProfileUpdate = function(req, res, next) {
    let userId = req.query.userId
    if(userId){
        adminService.orgUserProfileUpdate(userId, req.body)
            .then((resdata) => res.send(resdata))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "userId not found" })
    }
}
exports.sendEmailAppAccess = function(req, res, next) {
    adminService.sendEmailAppAccess(req.body)
        .then(emailDetails => res.json(emailDetails))
        .catch(err => next(err));
}
exports.domainVerification = function(req, res, next) {
    let orgUserEmail = req.query.orgUserEmail
    let domainName = req.query.domainName
    if(domainName && orgUserEmail){
    adminService.domainVerification(orgUserEmail, domainName)
        .then(userDetails => res.json(userDetails))
        .catch(err => next(err));
    }else {
        res.status(404).json({ message: "query params are not found" })
    }
}
exports.emailVerification = function(req, res, next) {
    let token = req.query.token
    if(token){
    adminService.emailVerification(token)
        .then(() => res.json({"message": "User Verified"}))
        .catch(err => next(err));
    }else {
        res.status(404).json({ message: "query params are not found" })
    }
}
exports.getActiveUserProfile = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        adminService.getActiveUserProfile(orgId)
            .then(users => res.json(users))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.getInactiveUserProfile = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        adminService.getInactiveUserProfile(orgId)
            .then(users => res.json(users))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.changePasswordBYUserId = function(req, res, next) {
    let userId = req.body.userId
    let password = req.body.password
    adminService.changePasswordBYUserId(userId, password)
        .then(users => res.json(users))
        .catch(err => next(err));
}
exports.ActiveInactiveUserProfile = function(req, res, next) {
    let isActive = req.body.isActive
    let userId = req.body.userId
    adminService.ActiveInactiveUserProfile(userId, isActive)
        .then(users => res.json(users))
        .catch(err => next(err));
}
exports.validatePlan = function(req, res, next) {
    const {orgId}=req.query
    adminService.validatePlan(orgId)
        .then(users => res.status(200).json(users))
        .catch(err => next(err));
}