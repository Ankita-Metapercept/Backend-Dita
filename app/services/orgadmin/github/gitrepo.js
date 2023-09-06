const axios = require('axios')
module.exports = {
    repoList,
    repoDetails,
    repoBranch,
    repoCollaborators,
    repoCommits,
    repoBranchCommits,
    repoRelease,
    repoCreateRelease
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
        return err
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
        return err
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
        return err
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
        return err
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
        return err
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
        return res.data
    }
    catch(err) {
        return err
    }
}
async function repoRelease(gitToken, repoUser, repoName ) {
    try {
        let res = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/releases`,
            headers: {
                Authorization: 'token ' + gitToken
            }
        })
        return res.data
    }
    catch(err) {
        return err
    }
}
async function repoCreateRelease(gitToken, repoUser, repoName, tag_name, target_commitish, name, body, draft, prerelease, generate_release_notes) {
    try {
        let data = {
            "tag_name":tag_name,
            "target_commitish":target_commitish,
            "name":name,
            "body":body,
            "draft":draft,
            "prerelease":prerelease,
            "generate_release_notes":generate_release_notes
        };
        let res = await axios({
            method: 'post',
            url: `https://api.github.com/repos/${repoUser}/${repoName}/releases`,
            headers: {
                Authorization: 'token ' + gitToken
            },
            data: data
        })
        return res.data
    }
    catch(err) {
        return err
    }
} 