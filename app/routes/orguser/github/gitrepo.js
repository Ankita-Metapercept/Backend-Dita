const express = require('express')
const gitRepo = require('../../../controllers/orguser/github/gitrepo.js')
const jwt = require('../../../config/orguser/jwt');
const router = express.Router()
router.use(jwt());

router.get('/orguser/repolist', gitRepo.repoList)
router.get('/orguser/repo', gitRepo.repoDetails)
router.get('/orguser/repobranches', gitRepo.repoBranch)
router.post('/orguser/repocontent', gitRepo.repoContent)
router.get('/orguser/repocontent', gitRepo.getRepoContent)
router.get('/orguser/branch/commitnotification', gitRepo.getBranchCommitNotification)
router.get('/orguser/repo/24hrsCommitNotifications',gitRepo.get24hrsCommitsNotification)

module.exports = router