const axios = require('axios');
const db = require('../../../config/db')
const GithubCollaborators = db.githubCollaborators
const _ = require('lodash')
module.exports = {
    addGitCollaborators,
    getGitCollaborators
}
// Add all github collaborators
async function addGitCollaborators(gitToken, orgId) {
    try{
    let repoList = await axios({
            method: 'get',
            url: `https://api.github.com/user/repos`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        repolistfun(repoList.data, gitToken).then(async(res)=> {
            const unique = _.uniq(_.map(res, 'id'))
            for await (const idele of unique){
                let newobj = _.filter(res, { 'id': idele });
                let githubCollaboratorsParams = {
                        orgId: orgId,
                        gitUserId: newobj[0].id,
                        gitUsername: newobj[0].login,
                        isDelete: false
                    }
                    let getcollab = await GithubCollaborators.findOne({ orgId: orgId, gitUserId: newobj[0].id })
                    if(getcollab === null){
                        const user = new GithubCollaborators(githubCollaboratorsParams);
                        await user.save();
                    }
            }
        })
        return true
    }
    catch(err){
        return err
    }
}
// Get list of all collaborators
async function repolistfun(repolist, gitToken){
    let collabArr = []
    for await (const element of repolist) {
        await collaboratordatafun(element.owner.login, element.name, gitToken).then(async(res)=>{
            for await (const ele of res){
                collabArr.push(ele)
            }
        })
    }
    return collabArr   
}
// Get list of collaboratos inside repository
async function collaboratordatafun(owner, repo, gitToken){
    let collabData = await axios({
        method: 'get',
        url: `https://api.github.com/repos/${owner}/${repo}/collaborators`,
        headers: {
            Authorization: 'token ' + gitToken
        }
    })
    return collabData.data
}
// get list of all collbaborators
async function getGitCollaborators(orgId) {
    return await GithubCollaborators.find({ orgId: orgId })
}