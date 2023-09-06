const express = require('express')
const jwt = require('../../config/orgadmin/jwt');
const orgUserController = require('../../controllers/orguser/orguserworkspace')
const router = express.Router()
router.use(jwt());

router.post('/orguser/workspace', orgUserController.addWorkspace);
router.get('/orguser/workspace/byuserId', orgUserController.getWorkspaceByUserId);
router.get('/orguser/workspace/repotree', orgUserController.getRepoTree);
router.get('/orguser/workspace/filecontent', orgUserController.getFileContent);
router.post('/orguser/workspace/savefilecontent', orgUserController.saveFileContent);
router.put('/orguser/workspace/commit', orgUserController.commitChanges);
router.get('/orguser/workspace/repolist', orgUserController.getRepoList);
router.get('/orguser/workspace/inputfiles', orgUserController.getInputFiles);
router.put("/orguser/workspace/sync", orgUserController.syncWorkspace);

module.exports = router