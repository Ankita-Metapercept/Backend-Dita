const adminService = require("../../services/orgadmin/notification.js");

exports.releasedByLastWeek = function (req, res, next) {
  adminService
    .releasedByLastWeek(req)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
};
exports.get24hrsCommitNotification = function (req,res,next){
  adminService
    .get24hrsCommitNotification(req)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}
exports.getSubscriptionDetails = function (req,res,next){
  adminService
    .getSubscriptionDetails(req.query.subscriptionId)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}