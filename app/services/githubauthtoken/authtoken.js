const db = require("../../config/db")
const User = db.githubAuthToken;
module.exports = {
  getGithubTokenById,
  addGithubToken,
  updateGithubToken,
  getGithubToken
};
// save github access token details
async function addGithubToken(tokenParam) {
  const user = new User(tokenParam);
  await user.save();
}
// update github access toke details
async function updateGithubToken(tokenParam,id) {
  const filter = { _id: id };
  let update = tokenParam;
  tokenParam.updatedAt = Date.now()
  let doc = await User.findOneAndUpdate(filter, update)
  doc = await User.findOne(filter);
  return doc
}
// get github token by user Id
async function getGithubTokenById(id) {
  return await User.findOne({userId: id});
}

// get all user github token
async function getGithubToken() {
  return await User.find();
}