const axios = require('axios')
const { orgAdmin, githubAuthToken,organization } = require("../../../config/db.js");

// const clientID = '7858968fbfedce596988'
// const clientSecret = '40f1df458c680ccd17baf7bc4d53c92680e7cfad'
const clientID = '8d53f7d23e73bb1c6b87'
const clientSecret = 'ccbbbd73c040b65a6cfec6cfe90eda5a1e5fa658'
module.exports = {
    gitAuthCallback,
    gitAuthSuccess,
    gitResetToken
};
async function gitAuthCallback(gitCode) {
    try {
        const { data: gitTokenData } = await axios({
          method: "post",
          url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${gitCode}`,
          scope: [
            "repo",
            "workflow",
            "write:packages",
            "delete:packages",
            "gist",
            "notifications",
            "user",
            "project",
            "codespace",
          ],
          headers: {
            accept: "application/json",
          },
        });
        const { data: userGitDetails } = await axios({
          method: "get",
          url: `https://api.github.com/user`,
          headers: {
            Authorization: "token " + gitTokenData.access_token,
          },
        });
        const gitUsernameRegex = new RegExp(userGitDetails.login, "i");
        const adminDetails = await orgAdmin.findOne({
          githubUsername: { $regex: gitUsernameRegex },
        });
        if (!adminDetails)
          throw "Please login with the same email, provided by your organization!";
        const orgDetails = await organization.findOne({_id:adminDetails.orgId})
        const gitTokenParams = {
          userId: adminDetails._id,
          orgId: adminDetails.orgId,
          username: userGitDetails.login,
          email: userGitDetails.email || "",
          token: gitTokenData.access_token,
          refreshToken: gitTokenData.access_token,
        };
        try {
          await githubAuthToken.insertMany([gitTokenParams]);
        } catch (error) {
          await githubAuthToken.updateOne({ userId:adminDetails._id, orgId:adminDetails.orgId }, gitTokenParams);
        }
        return orgDetails.adminHostURL;
      } catch (err) {
        throw err;
      }
}
// github login success response
async function gitAuthSuccess(req) {
    try {
        const { userid: userId, orgid: orgId } = req.headers;
        const gitTokenData = await githubAuthToken.findOne({userId,orgId})
        const { data: userGitDetails } = await axios({
          method: "get",
          url: `https://api.github.com/user`,
          headers: {
            Authorization: "token " + gitTokenData.token,
          },
        });
        
        return {
          userData: userGitDetails,
          access_token: gitTokenData.token,
        };
    } catch (err) {
        throw err;
    }
}
// github reset access token
async function gitResetToken(accessToken) {
    try {
        let res = await axios({
                headers: { "Content-Type": "application/vnd.github+json" },
                method: "patch",
                url: `https://api.github.com/applications/${clientID}/token`,
                auth: {
                  username: clientID,
                  password: clientSecret
                },
                data: {
                    access_token: accessToken
                }
              })
        return res.data
    }
    catch(err) {
        return err
    }
}
