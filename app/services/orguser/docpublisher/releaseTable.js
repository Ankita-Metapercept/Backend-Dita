const db = require("../../../config/db");
const { sendMail } = require("../../../utilities/sendMail");
const release = db.release;
const orgUser = db.orgUser;
const Admin = db.Admin
module.exports = {
  addRelease,
  getReleaseByUserId,
  getReleaseByOrgId,
  getReleaseById,
  updateRelease,
  deleteRelease,
};
// add new release table in database
async function addRelease(releaseTableBody) {
  try {
    const { orgId, userId } = releaseTableBody;
    const userDetails = await orgUser.findOne({ orgId, _id: userId });
    if (!userDetails) throw "Invalid user details orgId/userId";
    const newRelease = new release(releaseTableBody);
    await newRelease.save();
    const {adminId,email:userEmailId} = userDetails
    const adminDetails = await Admin.findOne({_id:adminId})
    const {email:adminEmailId} = adminDetails
    const subject = "New publish notification DitaxPresso"
    const mailBody = `${userEmailId} has published a new document with ${newRelease._doc.outputFormat} file format at ${new Date()}. Thank you!`
    sendMail(adminEmailId,subject,mailBody)
    return newRelease;
  } catch (error) {
    throw error;
  }
}
// get release tables by userId
async function getReleaseByUserId(userId) {
  try {
    return await release.find({ userId });
  } catch (error) {
    throw error;
  }
}
// get release tables by organization id
async function getReleaseByOrgId(orgId) {
  try {
    return await release.find({ orgId });
  } catch (error) {
    throw error;
  }
}
// get release table by id
async function getReleaseById(id) {
  try {
    return await release.find({ _id: id });
  } catch (error) {
    throw error;
  }
}
// update release table
async function updateRelease(id, updateParams) {
  try {
    await release.findOneAndUpdate({ _id: id }, updateParams);
    return await release.findById(id);
  } catch (error) {
    throw error;
  }
}
// delete release table
async function deleteRelease(id) {
  try {
    return await release.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
}
