const serverAdminService = require('../../services/serveradmin/ditaotversions')
exports.addVersion = function(req, res, next) {
    serverAdminService.addVersion(req.body)
        .then((versionData) => res.json(versionData))
        .catch(err => next(err))
}
exports.getVersion = function(req, res, next) {
    serverAdminService.getVersion(req.body)
        .then((versionData) => res.json(versionData))
        .catch(err => next(err))
}
exports.getVersionById = function(req, res, next) {
    let id = req.query.id
    serverAdminService.getVersionById(id)
        .then(planDetails => res.json(planDetails))
        .catch(err => next(err));
}