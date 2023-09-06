const serverAdminService = require('../../services/serveradmin/subscriptionplan')
exports.addSubscriptionPlan = function(req, res, next) {
    serverAdminService.addSubscriptionPlan(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}
exports.updateSubscriptionPlan = function(req, res, next) {
    let planId = req.query.planId
    if(planId){
        serverAdminService.updateSubscriptionPlan(req.body, planId)
            .then((planDetail) => res.json(planDetail))
            .catch(err => next(err))
    }else {
        res.status(404).json({ message: "planId not found" })
    }
}
exports.getSubscriptionPlan = function(req, res, next) {
    serverAdminService.getSubscriptionPlan()
        .then(planDetails => res.json(planDetails))
        .catch(err => next(err));
}
exports.getSubscriptionPlanById = function(req, res, next) {
    let planId = req.query.planId
    serverAdminService.getSubscriptionPlanById(planId)
        .then(planDetails => res.json(planDetails))
        .catch(err => next(err));
}