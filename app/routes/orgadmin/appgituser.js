const express = require('express')
const AddUser = require('../../controllers/orgadmin/appgituser.js')
const router = express.Router()

router.get('/orgadmin/:projectID/getuser', AddUser.getUser)
router.get('/orgadmin/:projectID/:userID/getuser', AddUser.getUserById)
router.post('/orgadmin/adduser', AddUser.addUser);
router.put('/orgadmin/adduser', AddUser.updateUser);
router.get('/orgadmin/:repoUser/:repoName/:projectId/test', AddUser.newUserNotification);
router.post('/orgadmin/sendmailtouser', AddUser.sendMailToUser);

module.exports = router