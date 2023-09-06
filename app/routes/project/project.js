const express = require('express')
const ProjectController = require('../../controllers/project/project')
const jwt = require('../../config/orgadmin/jwt');
const router = express.Router()
router.use(jwt());

router.post('/project', ProjectController.addProject)
router.put('/project', ProjectController.updateProject)
router.get('/project/byorgid', ProjectController.getProjectByOrgId)
router.get('/project/byprojectid', ProjectController.getProjectById)
router.get('/project/byuserid', ProjectController.getProjectByUserId)
router.get('/project/bygituserid', ProjectController.getProjectByGitUserId)
router.post('/project/repo/sync', ProjectController.syncProject)
router.get('/project/byorgid/byadminid', ProjectController.getProjectByOrgIdAdminId)
router.get('/project/outputtree', ProjectController.getOutputTree)
router.get('/project/githubtree', ProjectController.getGithubTree)
router.put('/alladmin/project', ProjectController.addAllAdminProject)

module.exports = router