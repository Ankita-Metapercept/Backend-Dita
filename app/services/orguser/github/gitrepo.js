const axios = require('axios')
const gitRepoUtilities = require("../../../utilities/orguser/github/gitrepo.js")
module.exports = {
  repoList,
  repoDetails,
  repoBranch,
  repoContent,
  getRepoContent,
  getBranchCommitNotification,
  get24hrsCommitsNotification,
};
const db = require("../../../config/db.js")
const projectUser = db.projectUser
const project = db.project
const _ = require("lodash");
// Get list of all repository
async function repoList(gitToken) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/user/repos`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data
    }
    catch(err) {
        throw err
    }
}
// Get repository details
async function repoDetails(gitToken, repoUser, repoName) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data
    }
    catch(err) {
        throw err
    }
}
// get all branch list
async function repoBranch(gitToken, repoUser, repoName) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/branches`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data
    }
    catch(err) {
        if(err.response.data.message === "Bad credentials"){
            throw "Your github auth token is either incorrect or expired."
        }
        throw err
    }
}
// save and commit file content in github
async function repoContent(gitToken, reqBody) {
    try {
        var encodedData = await Buffer.from(reqBody.content).toString('base64')
        var dataObj = {}
        if(reqBody.branch){
            dataObj = {
            message: reqBody.message,
            content: encodedData,
            branch: reqBody.branch,
            sha: reqBody.sha
        }
        }
        else{
            dataObj = {
            message: reqBody.message,
            content: encodedData,
            sha: reqBody.sha
            }
        }
        let saveResponse = await axios({
            method: 'put',
            url: `https://api.github.com/repos/${reqBody.repoUser}/${reqBody.repoName}/contents/${reqBody.repoPath}`,
            headers: {
              Authorization: 'token ' + gitToken
            },
            data: dataObj
          })
          return saveResponse.data
    }
    catch(err) {
        if(err.response.data.message === "Bad credentials"){
            throw "Your github auth token is either incorrect or expired."
        }
        throw err
    }
}
// get file sha and content
async function getRepoContent(gitToken, repoUser, repoName, repoBranch, repoPath) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/contents/${repoPath}?ref=${repoBranch}`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data
    }
    catch(err) {
        if(err.response.data.message === "Bad credentials"){
            throw "Your github auth token is either incorrect or expired."
        }
        throw err
    }
}
// get all branch commit list of alst 24 hours
async function getBranchCommitNotification(gitToken, repoUser, repoName, repoBranch) {
    try{
        let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
        let resCommit = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/commits?sha=${repoBranch}&since=${yesterday}`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return resCommit.data
    }
    catch(err){
        if(err.response.data.message === "Bad credentials"){
            throw "Your github auth token is either incorrect or expired."
        }
        throw err
    }
}
async function get24hrsCommitsNotification(gitToken, userId) {
    let recentCommitsList = [];
  try {
    const projectUsers = await projectUser.find({userId})
    const projectIdList = projectUsers.map((ele)=>{
        return ele.projectId
    })
    const userProjects = await project.find({_id:{$in:projectIdList}})
    //filter by last 24 hrs including +5:30 hrs lag in UTC
    const msInADay = 29.5*60*60*1000
    const timeFilter = new Date(new Date().getTime() - msInADay);
    // list of all commits in all repos
    for (const projectDetails of userProjects) {
      const { owner: repoUser, projectName: repoName } =
        projectDetails;
      const { data: branchList } = await axios({
        method: "get",
        url: `https://api.github.com/repos/${repoUser}/${repoName}/branches`,
        headers: {
          Authorization: "token " + gitToken,
        },
      });
        await gitRepoUtilities.getCommitsAcrossAllBranch(
          branchList,
          gitToken,
          repoUser,
          repoName,
          timeFilter,
          recentCommitsList
        )
    }
    recentCommitsList=recentCommitsList.map((data)=>{
        return {
            committer : data.commit.author,
            message : data.commit.message,
            projectName:data.projectName,
            comment_count: data.commit.comment_count
        }
    })
    recentCommitsList.sort(
        (a,b)=>new Date(b.committer.date) - new Date(a.committer.date)
    )
    return recentCommitsList;
  } catch (error) {
    if(recentCommitsList.length) return recentCommitsList;
    if(err.response.data.message === "Bad credentials"){
        throw "Your github auth token is either incorrect or expired."
    }
    throw err
  }
}