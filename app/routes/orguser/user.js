const express = require('express')
const jwt = require('../../config/orgadmin/jwt');
const orgUserController = require('../../controllers/orguser/user.js')
const router = express.Router()
router.use(jwt());

router.post('/orguser/register', orgUserController.addOrgUser);
router.post('/orguser/authenticate', orgUserController.authenticate);
router.put('/orguser/details', orgUserController.updateOrgUser);
router.put('/orguser/profileupdate', orgUserController.orgUserProfileUpdate);
router.get('/orguser/details', orgUserController.getUserById);
router.get('/orguser/details/bygithubCollaboratorid', orgUserController.getUserGithubCollaboratorId);
router.get('/orguser/byorgid', orgUserController.getUsersByOrgId);
router.post('/orguser/appaccessemail', orgUserController.sendEmailAppAccess)
router.get('/orguser/domainverification', orgUserController.domainVerification)
router.put('/orguser/emailverification', orgUserController.emailVerification)
router.get('/orguser/active/profile', orgUserController.getActiveUserProfile)
router.get('/orguser/inactive/profile', orgUserController.getInactiveUserProfile)
router.put('/orguser/changepassword/byuserid', orgUserController.changePasswordBYUserId);
router.put('/orguser/activeinactive/profile', orgUserController.ActiveInactiveUserProfile);
router.get("/orguser/validatePlan",orgUserController.validatePlan)

module.exports = router