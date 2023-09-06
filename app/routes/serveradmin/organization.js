
const express = require('express')
const ServerOrganization = require('../../controllers/serveradmin/organization')
const jwt = require('../../config/orgadmin/jwt');
const router = express.Router()
router.use(jwt());

router.post('/serveradmin/organization', ServerOrganization.addNewOrganization)
router.put('/serveradmin/domainactive', ServerOrganization.activeDomain)
router.put('/serveradmin/organization', ServerOrganization.updateOrganization)
router.get('/serveradmin/organization', ServerOrganization.getOrganization)
router.get('/serveradmin/organization/details', ServerOrganization.getOrganizationDetails)
router.get('/serveradmin/organization/byorgid', ServerOrganization.getOrganizationById)
router.put('/serveradmin/organization/deactive', ServerOrganization.deactiveOrganization)
router.put('/serveradmin/organization/active', ServerOrganization.activeOrganization)
router.post('/serveradmin/appaccessemail', ServerOrganization.sendEmailAppAccess)
router.put('/serveradmin/updatesubscriptionplan', ServerOrganization.updateSubscriptionPlan)
router.get('/serveradmin/byid', ServerOrganization.getServeradminById)
router.put('/serveradmin/changepassword/byserveradminid', ServerOrganization.changePasswordByServerAdminId)
router.get('/serveradmin/organization/downloadxls/byorgid',ServerOrganization.downloadOrgXls)
module.exports = router