const projectServices = require('../../services/project/project')
// add/ create project
exports.addProject = function(req, res, next) {
    projectServices.addProject(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}
// update project details
exports.updateProject = function(req, res, next) {
    let projectId = req.query.projectId
    if(projectId){
        projectServices.updateProject(req.body, projectId)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err))
    }else {
        res.status(404).json({ message: "projectId not found" })
    }
}
// get list of all project by organization id
exports.getProjectByOrgId = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        projectServices.getProjectByOrgId(orgId)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err));
        }else {
            res.status(404).json({ message: "orgId not found" })
        }
}
// get project details by id
exports.getProjectById = function(req, res, next) {
    let projectId = req.query.projectId
    if(projectId){
        projectServices.getProjectById(projectId)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "projectId not found" })
    }
}
// sync project
exports.syncProject = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let orgId = req.query.orgId
    let orgAdminId = req.query.orgAdminId
    projectServices.syncProject(gitToken, orgId, orgAdminId)
        .then((projectDetail) => res.send(projectDetail))
        .catch(err => next(err));
}
// get project with organization Id and organization admin Id
exports.getProjectByOrgIdAdminId = function(req, res, next) {
    let orgId = req.query.orgId
    let orgAdminId = req.query.orgAdminId
    if(orgId && orgAdminId){
        projectServices.getProjectByOrgIdAdminId(orgId, orgAdminId)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "query not found" })
    }
}
// get project by user id
exports.getProjectByUserId = function(req, res, next) {
    let userId = req.query.userId
    if(userId){
        projectServices.getProjectByUserId(userId)
            .then((projectDetail) => res.send(projectDetail))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "userId not found" })
    }
}
// get project by git user id
exports.getProjectByGitUserId = function(req, res, next) {
    let githubUserId = req.query.githubUserId
    let gitToken = req.header('gitToken')
    if(githubUserId){
        projectServices.getProjectByGitUserId(gitToken, githubUserId)
            .then((projectDetail) => res.send(projectDetail))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "githubUserId not found" })
    }
}
// get object of output tree
exports.getOutputTree = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let gitUsername = req.query.gitUsername
    let gitReponame = req.query.gitReponame
    let branchsha = req.query.branchsha
    if(gitUsername && gitReponame && branchsha){
        projectServices.getOutputTree(gitToken, gitUsername, gitReponame, branchsha)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err));
        }else {
            res.status(404).json({ message: "query params are not found" })
        }
}
// get object of github tree
exports.getGithubTree = function(req, res, next) {
    let gitToken = req.header('gitToken')
    let gitUsername = req.query.gitUsername
    let gitReponame = req.query.gitReponame
    let branchsha = req.query.branchsha
    if(gitUsername && gitReponame && branchsha){
        projectServices.getGithubTree(gitToken, gitUsername, gitReponame, branchsha)
            .then((projectDetail) => res.json(projectDetail))
            .catch(err => next(err));
        }else {
            res.status(404).json({ message: "query params are not found" })
        }
}
// add/ create all admin project
exports.addAllAdminProject = function(req, res, next) {
    projectServices.addAllAdminProject()
        .then((user) => res.send(user))
        .catch(err => next(err))
}