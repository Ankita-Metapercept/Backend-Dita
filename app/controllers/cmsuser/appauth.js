const cmsuserService = require('../../services/cmsuser/appauth');
const express = require('express');
const jwt = require('../../config/jwt');


const app = express()

app.use(jwt());

exports.authenticate = function(req, res, next) {
    cmsuserService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

exports.register = function(req, res, next) {
    cmsuserService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

exports.getAll = function(req, res, next) {
    cmsuserService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

exports.getCurrent = function(req, res, next) {
    cmsuserService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

exports.getById = function(req, res, next) {
    cmsuserService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

exports.update = function(req, res, next) {
    cmsuserService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

exports._delete = function(req, res, next) {
    cmsuserService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}