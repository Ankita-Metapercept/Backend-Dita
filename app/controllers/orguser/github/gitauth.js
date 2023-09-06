const gitAuth = require('../../../services/orguser/github/gitauth.js')

exports.gitAuthCallback = async function(req, res, next) {
    gitAuth.gitAuthCallback(req.query.code)
        .then((userHostURL) => res.redirect(`${userHostURL||"http://localhost:8080/"}docmanager?code=${req.query.code}`))
        .catch(err => next(err))
}
exports.gitAuthSuccess = function(req, res, next) {
    gitAuth.gitAuthSuccess(req)
        .then((data) => res.status(201).json(data))
        .catch(err => next(err))
}
exports.gitResetToken = function(req, res, next) {
    gitAuth.gitResetToken(req.body.access_token,req.headers)
        .then((data) => res.json(data))
        .catch(err => next(err))
}