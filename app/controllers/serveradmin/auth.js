const userService = require('../../services/serveradmin/auth')
const express = require('express')
exports.authenticate = function(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err))
}
exports.register = function(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}