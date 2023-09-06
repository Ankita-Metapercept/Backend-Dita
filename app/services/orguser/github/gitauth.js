const axios = require("axios");
const { orgUser, githubAuthToken,organization } = require("../../../config/db.js");

const clientID = "dbcf89847346091ebacd";
const clientSecret = "958bb1000f0af726c5960006fc7c2f450789372e";
module.exports = {
  gitAuthCallback,
  gitAuthSuccess,
  gitResetToken,
};
// github callback function for organization user
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
    const userDetails = await orgUser.findOne({
      githubUsername: { $regex: gitUsernameRegex },
    });
    if (!userDetails)
      throw "Please login with the same email, provided by your organization!";
    const orgDetails = await organization.findOne({_id:userDetails.orgId})
    const gitTokenParams = {
      userId: userDetails._id,
      orgId: userDetails.orgId,
      username: userGitDetails.login,
      email: userGitDetails.email || "",
      token: gitTokenData.access_token,
      refreshToken: gitTokenData.access_token,
    };
    try {
      await githubAuthToken.insertMany([gitTokenParams]);
    } catch (error) {
      await githubAuthToken.updateOne({ userId:userDetails._id, orgId:userDetails.orgId }, gitTokenParams);
    }
    return orgDetails.userHostURL;
  } catch (err) {
    throw err;
  }
}
//Get login user details
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
// github reset access token for organization user
async function gitResetToken(accessToken, userDetails) {
  try {
    let res = await axios({
      headers: { "Content-Type": "application/vnd.github+json" },
      method: "patch",
      url: `https://api.github.com/applications/${clientID}/token`,
      auth: {
        username: clientID,
        password: clientSecret,
      },
      data: {
        access_token: accessToken,
      },
    });
    const { userid: userId, orgid: orgId } = userDetails;
    await githubAuthToken.updateOne(
      { userId, orgId },
      {
        token: res.data.token,
        refreshToken: res.data.token,
      }
    );
    return { token: res.data.token };
  } catch (err) {
    throw err;
  }
}
