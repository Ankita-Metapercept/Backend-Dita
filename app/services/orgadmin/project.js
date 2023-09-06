const axios = require('axios')
const _ = require('lodash')
const db = require('../../config/db')
const Project = db.project
const ProjectUser = db.projectUser
const Organization = db.organization
module.exports = {
    getOrgProjectList,
    getProjectFileCount
};
// get project list with github collaborator count and project user count
async function getOrgProjectList( orgId ) {
    let projectData = await Project.find({ orgId: orgId })
    let projectDataArr = []
    for await (pdata of projectData) {
        let resProjectUser = await ProjectUser.find({ projectId: pdata._id })
        let newObj = {
            id: pdata._id,
            projectName: pdata.projectName,
            projectNodeId: pdata.projectNodeId,
            projectRepoId: pdata.projectRepoId,
            orgId: pdata.orgId,
            owner: pdata.owner,
            gitCollaboratorsCount: pdata.gitCollaboratorsCount,
            isDeleted: pdata.isDeleted,
            createdAt: pdata.createdAt,
            updatedAt: pdata.updatedAt,
            __v: pdata.__v,
            projectUserCount: resProjectUser.length
        }
        projectDataArr.push(newObj)  
    }
    return await projectDataArr
}
// get total file count
async function getProjectFileCount(gitToken, orgId) {
    let projectData = await Project.find({ orgId: orgId })
    try {
        let fileCount = 0
        for await (const pdata of projectData){
            let resBranches = await axios({
                method: 'get',
                url: `https://api.github.com/repos/${pdata.owner}/${pdata.projectName}/branches`,
                headers: {
                    Authorization: 'token ' + gitToken
                }
            })
            await getTree(gitToken, resBranches.data, pdata.owner, pdata.projectName).then((resTree)=> {
                fileCount = fileCount + resTree
            })
        }
        await Organization.findOneAndUpdate({ _id: orgId }, { fileCount: fileCount})
        return await { fileCount: fileCount }
    }
    catch(err) {
        return err
    }
}
// get github files
async function getTree(gitToken, branchesArr, repoUser, repoName) {
    let countArr = 0
    for await (const bdata of branchesArr){
        await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/git/trees/${bdata.commit.sha}?recursive=true`,
            headers: {
              Authorization: 'token ' + gitToken
            }
          }).then(async(response) => {
            let blobData = _.filter(response.data.tree, (e)=>{ return e.type === "blob"  })
            countArr = countArr + blobData.length
          }).catch((err)=> {
            res.send(err)
          })
    }
    return await countArr
}