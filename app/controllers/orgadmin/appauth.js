const adminService = require('../../services/orgadmin/appauth');
const express = require('express')
// organization admin authentication
exports.authenticate = function(req, res, next) {
    adminService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}
// Add organization admin
exports.addOrgAdmin = function(req, res, next) {
    adminService.addOrgAdmin(req.body)
        .then((admindata) => res.json(admindata))
        .catch(err => next(err));
}
// Get List of all organization admin
exports.getAll = function(req, res, next) {
    adminService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
// Get List of organization admin by id
exports.getOrgAdminById = function(req, res, next) {
    let userId = req.query.userId
    adminService.getOrgAdminById(userId)
        .then(users => res.json(users))
        .catch(err => next(err));
}
// Get List of organization admin by orgnization id
exports.getOrgAdminByOrgId = function(req, res, next) {
    let orgId = req.query.orgId
    adminService.getOrgAdminByOrgId(orgId)
        .then(users => res.json(users))
        .catch(err => next(err));
}
// Update organization Admin details
exports.updateOrgAdmin = function(req, res, next) {
    let orgAdminId = req.query.orgAdminId
    adminService.updateOrgAdmin(orgAdminId, req.body)
        .then((resdata) => res.send(resdata))
        .catch(err => next(err));
}
// organization admin domain verification
exports.domainVerification = function(req, res, next) {
    let orgAdminEmail = req.query.orgAdminEmail
    let domainName = req.query.domainName
    if(domainName && orgAdminEmail){
    adminService.domainVerification(orgAdminEmail, domainName)
        .then(users => res.json(users))
        .catch(err => next(err));
    }else {
        res.status(404).json({ message: "query params are not found" })
    }
}
// organization admin email verification
exports.emailVerification = function(req, res, next) {
    let token = req.query.token
    if(token){
    adminService.emailVerification(token)
        .then(() => res.json({"message": "Organization Admin Verified"}))
        .catch(err => next(err));
    }else {
        res.status(404).json({ message: "query params are not found" })
    }
}
// organization admin change password
exports.changePassword = function(req, res, next) {
    adminService.changePassword(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}
// organization admin forgot Password
exports.forgotPassword = function(req, res, next) {
    adminService.forgotPassword(req.body)
        // .then(user => user !== 'inactive' ? res.json(user) : res.status(400).json({ message: 'Your account is inactive' }))
        .then(user => user ? res.json({ message: user }) : res.status(400).json({ message: 'Email is incorrect' }))
        .catch(err => next(err));
}
// organization admin forgotpassword token verification
exports.forgotPasswordTokenVerify = function(req, res, next) {
    let token = req.body.token
    if(token){
    adminService.forgotPasswordTokenVerify(token)
        .then(tokenstatus => res.json({ message: tokenstatus }))
        .catch(err => next(err));
    }else {
        res.status(404).json({ message: "token not found" })
    }
}
// organization admin reset password
exports.resetpassword = function(req, res, next) {
    adminService.resetpassword(req.body)
        .then(user => res.json({ message: user }))
        .catch(err => next(err));
}
// Change Password By Admin Id
exports.changePasswordByAdminId = function(req, res, next) {
    let orgAdminId = req.body.orgAdminId
    let password = req.body.password
    adminService.changePasswordByAdminId(orgAdminId, password)
        .then(admin => res.json(admin))
        .catch(err => next(err));
}
// Active inactive admin by Id
exports.ActiveInactiveAdminProfile = function(req, res, next) {
    let isActive = req.body.isActive
    let orgAdminId = req.body.orgAdminId
    adminService.ActiveInactiveAdminProfile(orgAdminId, isActive)
        .then(admin => res.json(admin))
        .catch(err => next(err));
}
// organization admin reset forgot password
exports.resetForgotPassword = function(req,res,next){
    adminService
      .resetForgotPassword(req.body)
      .then((user) => res.json({ message: user }))
      .catch((err) => next(err));
}