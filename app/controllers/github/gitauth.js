const gitAuth = require('../../services/github/gitauth.js')
const express = require('express')
// const jwt = require('../config/jwt')

const app = express()

// app.use(jwt());

var access_token = "";

exports.gitAuthCallback = function(req, res, next) {
    gitAuth.gitAuthCallback(req.query.code)
        .then((user) => {
            access_token = user.access_token
            res.redirect('http://localhost:8080/github')
        })
        .catch(err => next(err))
}

exports.gitAuthSuccess = function(req, res, next) {
    gitAuth.gitAuthSuccess(access_token)
        .then((response) => {
            var resObj = {
                userData: response,
                access_token: access_token
              }
              access_token = ""
            return res.json(resObj)
        })
        .catch(err => next(err))
}