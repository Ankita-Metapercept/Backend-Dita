const userService = require('../../services/aws-sdk/gits3data.js');
const express = require('express');
const jwt = require('../../config/jwt');


const app = express()

app.use(jwt());

exports.register = function(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

exports.getAll = function(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

exports._delete = function(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// const userService = require('../../Services/aws-sdk/gits3data.js');
// const express = require('express');
// const jwt = require('../../config/jwt');


// const app = express()

// app.use(jwt());

// exports.register = function(req, res, next) {
//     userService.create(req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// exports.getAll = function(req, res, next) {
//     userService.getAll()
//         .then(users => res.json(users))
//         .catch(err => next(err));
// }

// exports._delete = function(req, res, next) {
//     userService.delete()
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }