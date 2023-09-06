const { release,project } = require("../../config/db.js");
const axios = require("axios");
const subscription = require("../../model/serveradmin/subscription.js");

module.exports = {
  releasedByLastWeek,
  get24hrsCommitNotification,
  getSubscriptionDetails
};
// get release done by all orgUsers for last 7 days
async function releasedByLastWeek(req) {
  try {
    const { orgId } = req.query;
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const allReleases = await release
      .find({ updatedAt: { $gte: lastWeek }, orgId })
      .sort({ updatedAt: -1 });
    return allReleases;
  } catch (error) {
    throw error;
  }
}
// get list of commit done within last 24 hrs
async function get24hrsCommitNotification(req) {
  const notification = [];
  try {
    const { orgId } = req.query;
    const { gittoken } = req.headers;
    const projectList = await project.find({ orgId });
    if(!projectList.length){
      throw "Projects not synced or admin does not exists!"
    }
    //filter by last 24 hrs including +5:30 hrs lag in UTC
    const msInADay = 29.5 * 60 * 60 * 1000;
    const timeFilter = new Date(new Date().getTime() - msInADay);
    for (const projectDetails of projectList) {
      try {
        const { projectName: repoName, owner,isFork,defaultBranch } = projectDetails;
      if(isFork) continue;
      const { data: commitList } = await axios({
        method: "get",
        url: `https://api.github.com/repos/${owner}/${repoName}/commits?sha=${defaultBranch}&since=${timeFilter}`,
        headers: {
          Authorization: "token " + gittoken,
        },
      });
      // pushing each commit data in recent commit list
      commitList.forEach((commitData) => {
        const data = {
          commiter: commitData.commit.author,
          message: commitData.commit.message,
          projectName: repoName,
        };
        notification.push(data)
      });
      } catch (error) {
        continue
      }
    }
    notification.sort(
      (a,b)=>new Date(b.commiter.date) - new Date(a.commiter.date))
    return notification
  } catch (error) {
    if (error.response && error.response.data.message === "Bad credentials" ) 
    throw "Invalid git token!"
    if (typeof error === "string") throw error;
    notification.sort(
      (a,b)=>new Date(b.commiter.date) - new Date(a.commiter.date))
    return notification
  }
}
async function getSubscriptionDetails(subscriptionId){
  try {
    const subscriptionDetails = await subscription.findOne({_id:subscriptionId}).populate("subscriptionPlanRef")
    return subscriptionDetails
  } catch (error) {
    throw error
  }
}