const projectUserServices = require('../../services/project/projectuser')
// add/ create project user
exports.addProjectUser = function(req, res, next) {
    projectUserServices.addProjectUser(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}
// update project details
exports.updateProjectUser = function(req, res, next) {
    let projectUserId = req.query.projectUserId
    if(projectUserId){
        projectUserServices.updateProjectUser(req.body, projectUserId)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err))
    }else{
        res.status(404).json({ message: "projectUserId not found" })
    }
}
// update project user with assign github user
exports.projectUserAssignGitUser = function(req, res, next) {
    let userId = req.body.userId
    let userProfileParams = {
        githubCollaboratorId: req.body.githubUserId,
        githubUsername: req.body.githubUsername,
        projects: [req.body.githubProjectId],
        userRole: req.body.userRole,
        isRoleAssign: true
    }
    let projectUserParam = {
        projectId: req.body.projectId,
        userId: req.body.userId,
        githubUsername: req.body.githubUsername,
        githubEmail: req.body.githubEmail,
        githubUserId: req.body.githubUserId,
        userRole: req.body.userRole,
        acceptInvitation: req.body.acceptInvitation,
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted,
        projectName: req.body.projectName
    }
    projectUserServices.projectUserAssignGitUser(projectUserParam, userProfileParams, userId)
        .then((projectUserDetails) => res.json(projectUserDetails))
        .catch(err => next(err))
}
// get project user by Id
exports.getProjectUserById = function(req, res, next) {
    let projectUserId = req.query.projectUserId
    if(projectUserId){
        projectUserServices.getProjectUserById(projectUserId)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "projectUserId not found" })
    }
}
// get list of all project user by project id
exports.getProjectUserByProjectId = function(req, res, next) {
    let projectId = req.query.projectId
    if(projectId){
        projectUserServices.getProjectUserByProjectId(projectId)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "projectId not found" })
    }
}
// get list of all project users
exports.getProjectUsers = function(req, res, next) {
    projectUserServices.getProjectUsers(req.params.id)
        .then((projectUserDetails) => res.json(projectUserDetails))
        .catch(err => next(err));
}
exports.getNewUserGithubNotification = function(req, res, next) {
    let projectId = req.query.projectId
    if(projectId){
        projectUserServices.getNewUserGithubNotification(req.header('gitToken'),projectId, req.body)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "projectId not found" })
    }
}
exports.getNewUserMongoNotification = function(req, res, next) {
    let projectId = req.query.projectId
    if(projectId){
        projectUserServices.getNewUserMongoNotification(req.header('gitToken'), projectId, req.body)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "projectId not found" })
    }
}
// get project user by project user Id and project Id
exports.getUserByProjectIdProjectUserId = function(req, res, next) {
    let projectId = req.query.projectId
    let userId = req.query.userId
    if(userId && projectId){
        projectUserServices.getUserByProjectIdProjectUserId(projectId, userId)
            .then((projectUserDetails) => res.json(projectUserDetails))
            .catch(err => next(err));
    }else {
        res.status(404).json({ message: "Query params not found" })
    }
}