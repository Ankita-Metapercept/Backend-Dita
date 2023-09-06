const express = require('express')
const gitRepo = require('../../../controllers/orgadmin/github/gitrepo.js')
const jwt = require('../../../config/orgadmin/jwt');
const router = express.Router()
router.use(jwt());

router.get('/orgadmin/repolist', gitRepo.repoList)
router.get('/orgadmin/repodetail', gitRepo.repoDetails)
router.get('/orgadmin/repobranches', gitRepo.repoBranch)
router.get('/orgadmin/repocollaborators', gitRepo.repoCollaborators)
router.get('/orgadmin/repocommit', gitRepo.repoCommits)
router.get('/orgadmin/repocommit/branch', gitRepo.repoBranchCommits)
router.get('/orgadmin/reporelease', gitRepo.repoRelease)
router.post('/orgadmin/repocreaterelease', gitRepo.repoCreateRelease)

module.exports = router