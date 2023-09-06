const express = require('express')
const router = express.Router()
const gitRepo = require('../../controllers/github/gitrepo.js')

const app = express()

router.get('/repoList', gitRepo.repoList)
router.get('/:repoUser/:repoName/repo', gitRepo.repoDetails)
router.get('/:repoUser/:repoName/repoBranches', gitRepo.repoBranch)
router.get('/:repoUser/:repoName/repocollaborators', gitRepo.repoCollaborators)
router.get('/:repoUser/:repoName/repoCommit', gitRepo.repoCommits)
router.get('/:repoUser/:repoName/branch/:branchName/repoCommit', gitRepo.repoBranchCommits)

module.exports = router