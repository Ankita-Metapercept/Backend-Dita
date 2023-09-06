const axios = require('axios')

module.exports = {
    repoList,
    repoDetails,
    repoBranch,
    repoCollaborators,
    repoCommits,
    repoBranchCommits
};

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

// Get list of all branch inside repository
async function repoBranch(gitToken,repoUser, repoName ) {
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
        throw err
    }
}

// Get list of all collaborators inside repository
async function repoCollaborators(gitToken,repoUser, repoName ) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/collaborators`,
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

// Get list of all commits inside repository default branch
async function repoCommits(gitToken, repoUser, repoName ) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/commits`,
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

// Get list of all commits inside repository selected branch
async function repoBranchCommits(gitToken, repoUser, repoName, branchName ) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/commits?sha=${branchName}`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data;
    }
    catch(err) {
        throw err
    }
}

  