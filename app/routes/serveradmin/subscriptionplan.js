const express = require('express')
const SubscriptionPlanController = require('../../controllers/serveradmin/subscriptionplan')
const jwt = require('../../config/orgadmin/jwt');
const router = express.Router()
router.use(jwt());

router.post('/serveradmin/subscriptionplan', SubscriptionPlanController.addSubscriptionPlan)
router.put('/serveradmin/subscriptionplan', SubscriptionPlanController.updateSubscriptionPlan)
router.get('/serveradmin/subscriptionplan', SubscriptionPlanController.getSubscriptionPlan)
router.get('/serveradmin/subscriptionplan/byid', SubscriptionPlanController.getSubscriptionPlanById)

module.exports = router