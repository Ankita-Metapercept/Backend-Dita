const adminService = require('../../services/orgadmin/plugindetails');

exports.addDetails = function(req, res, next) {
    adminService.addDetails(req.body)
        .then(user => res.send(user))
        .catch(err => next(err));
}
exports.getDetails = function(req, res, next) {
    adminService.getDetails()
        .then(user => res.send(user))
        .catch(err => next(err));
}
