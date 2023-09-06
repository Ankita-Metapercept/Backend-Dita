const db = require('../../config/db')
const ProjectUser = db.projectUser
const User = db.orgUser
const axios = require('axios');
const _ = require('lodash')
module.exports = {
    addProjectUser,
    updateProjectUser,
    projectUserAssignGitUser,
    getProjectUserById,
    getUserByProjectIdProjectUserId,
    getProjectUserByProjectId,
    getProjectUsers,
    getNewUserGithubNotification,
    getNewUserMongoNotification
};
// add project user inside organization
async function addProjectUser(projectUserParam) {
    const projectuser = new ProjectUser(projectUserParam);
    await projectuser.save();
}
// update project user deatails
async function updateProjectUser(projectUserParam,id) {
      const filter = { _id: id };
      let update = projectUserParam;
      projectUserParam.updatedAt = Date.now()
      let doc = await ProjectUser.findOneAndUpdate(filter, update)
      doc = await ProjectUser.findOne(filter);
      return doc
}
// update project user with assign github user
async function projectUserAssignGitUser(projectUserParam, userProfileParams, userId) { 
    const userDetails = await User.findOne({_id:userId})
    if(userDetails.isRoleAssign){
        await User.updateOne({ _id: userId }, {$push: {
            projects: {
                $each: userProfileParams.projects
            }
        }})
    }else{
        await User.updateOne({ _id: userId },userProfileParams)
    }
    const projectuser = new ProjectUser(projectUserParam);
    return await projectuser.save();
}
// get project user by id
async function getProjectUserById(id) {
    return await ProjectUser.find({ _id: id })
}
// get list of project users by project id
async function getProjectUserByProjectId(id) {
    return await ProjectUser.find({ projectId: id })
}
// get list of all project users
async function getProjectUsers() {
    return await ProjectUser.find();
}
// Get list of user which added in github not in DITAxPresso
async function getNewUserGithubNotification(gitToken, id, repoDetail) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoDetail.repoUser}/${repoDetail.repoName}/collaborators`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        let userData = await ProjectUser.find({projectId: id})
        let comdata = []
        res.data.forEach(async(element) => {
        var userCount = (_.filter(userData, (e)=> { return e.githubUsername === element.login }))
        if(userCount.length ==+ 0){
            // return true
            comdata.push(element)
            // console.log("true")
        }
    });
    return await comdata
    }
    catch(err) {
        return err
    }
}
// Get list of user which is added in ditaxpresso but not in github
async function getNewUserMongoNotification(gitToken, id, repoDetail) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoDetail.repoUser}/${repoDetail.repoName}/collaborators`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        let userData = await ProjectUser.find({projectId: id})
        let comdata = []
        userData.forEach(async(element) => {
            let userCount = (_.filter(res.data, (e)=> {return e.login === element.githubUsername}))
            // console.log(userCount)
            if(userCount.length === 0){
                comdata.push(element)
            }
    });
    return await comdata
    }
    catch(err) {
        return err
    }
}
// get project user by project user Id and project Id
async function getUserByProjectIdProjectUserId(projectId, userId) {
    return await ProjectUser.findOne({ projectId: projectId, userId: userId });
}
