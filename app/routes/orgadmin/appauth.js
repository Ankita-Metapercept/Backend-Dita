const express = require('express')
const orgAdminController = require('../../controllers/orgadmin/appauth.js');
const router = express.Router()

router.post('/orgadmin/authenticate', orgAdminController.authenticate);
router.post('/orgadmin/register', orgAdminController.addOrgAdmin);
router.get('/orgadmin', orgAdminController.getAll);
router.get('/orgadmin/byid', orgAdminController.getOrgAdminById);
router.get('/orgadmin/byorgid', orgAdminController.getOrgAdminByOrgId);
router.put('/orgadmin', orgAdminController.updateOrgAdmin);
router.get('/orgadmin/domainverification', orgAdminController.domainVerification);
router.put('/orgadmin/emailverification', orgAdminController.emailVerification);
router.put('/orgadmin/changepassword', orgAdminController.changePassword);
router.post('/orgadmin/forgotpassword', orgAdminController.forgotPassword);
router.post('/orgadmin/forgotPasswordTokenVerify', orgAdminController.forgotPasswordTokenVerify);
router.put('/orgadmin/resetpassword', orgAdminController.resetpassword);
router.put('/orgadmin/changepassword/byadminid', orgAdminController.changePasswordByAdminId);
router.put('/orgadmin/activeinactive/profile', orgAdminController.ActiveInactiveAdminProfile);
router.put('/orgadmin/resetforgotpassword',orgAdminController.resetForgotPassword)
module.exports = router