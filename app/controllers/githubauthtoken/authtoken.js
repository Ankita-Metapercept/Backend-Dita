const serverAdminService = require('../../services/githubauthtoken/authtoken')

exports.addGithubToken = function(req, res, next) {
    serverAdminService.addGithubToken(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}
exports.updateGithubToken = function(req, res, next) {
    let docId = req.query.id
    if(docId){
        serverAdminService.updateGithubToken(req.body, docId)
            .then((user) => res.json(user))
            .catch(err => next(err))
    }else{
        res.status(404).json({ message: "id not found" })
    }
}
exports.getGithubTokenById = function(req, res, next) {
    let userId = req.query.userId
    if(userId){
        serverAdminService.getGithubTokenById(userId)
            .then(user => res.json(user))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "userId not found" })
    }
}
exports.getGithubToken = function(req, res, next) {
    serverAdminService.getGithubToken()
        .then(users => res.json(users))
        .catch(err => next(err));
}