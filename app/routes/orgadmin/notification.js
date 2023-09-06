const router = require("express").Router()
const orgAdminController = require("../../controllers/orgadmin/notification.js")

router.get('/orgadmin/notification/releasedByLastWeek',orgAdminController.releasedByLastWeek)
router.get('/orgadmin/notification/24hrsCommit',orgAdminController.get24hrsCommitNotification)
router.get("/orgadmin/subscriptionDetails",orgAdminController.getSubscriptionDetails)

module.exports = router