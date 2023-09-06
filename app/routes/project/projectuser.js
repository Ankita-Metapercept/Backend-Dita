const express = require('express')

const router = express.Router()

const jwt = require('../../config/orgadmin/jwt');
const ProjectUserController = require('../../controllers/project/projectuser')
router.use(jwt());

router.post('/projectuser', ProjectUserController.addProjectUser)
router.put('/projectuser', ProjectUserController.updateProjectUser)
router.post('/projectuser/assigngituser', ProjectUserController.projectUserAssignGitUser)
router.get('/projectuser/byprojectuserid', ProjectUserController.getProjectUserById)
router.get('/projectuser', ProjectUserController.getProjectUsers)
router.get('/projectuser/byprojectid', ProjectUserController.getProjectUserByProjectId)
router.get('/projectuser/byprojectid/byprojectuserid', ProjectUserController.getUserByProjectIdProjectUserId)
router.post('/projectuser/project/git/notification', ProjectUserController.getNewUserGithubNotification)
router.post('/projectuser/project/app/notification', ProjectUserController.getNewUserMongoNotification)

module.exports = router