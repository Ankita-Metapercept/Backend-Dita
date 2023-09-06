const gitAuth = require('../../../services/orgadmin/github/gitauth.js')

exports.gitAuthCallback = function(req, res, next) {
    gitAuth.gitAuthCallback(req.query.code)
        .then((adminHostURL) => res.redirect(`${adminHostURL||"http://localhost:8080/"}github?code=${req.query.code}`))
        .catch(err => next(err))
}
exports.gitAuthSuccess = function(req, res, next) {
    gitAuth.gitAuthSuccess(req)
        .then((data) => res.status(201).json(data))
        .catch(err => next(err))
}
exports.gitResetToken = function(req, res, next) {
    gitAuth.gitResetToken(req.body.access_token)
        .then((response) => {
            return res.json(response)
        })
        .catch(err => next(err))
}