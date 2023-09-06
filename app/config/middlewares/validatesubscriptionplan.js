const { organization } = require("../db.js");

exports.validateSubscriptionPlan = async function (req, res, next) {
  try {
    if (
      req.originalUrl === "/api/orguser/authenticate" ||
      req.originalUrl === "/api/generateSessionId" ||
      req.originalUrl === "/api/orgadmin/authenticate" ||
      req.originalUrl === "/api/orguser/register" || 
      req.originalUrl === "/api/orgadmin/forgotpassword" ||
      req.originalUrl === "/api/orgadmin/forgotPasswordTokenVerify" ||
      req.originalUrl === "/api/orgadmin/resetforgotpassword" ||
      req.originalUrl.includes("/github/callback") ||
      req.originalUrl.includes("/api/project/repo/sync")
    ) {
      return next();
    }
    const { orgid: orgId } = req.headers;
    const organizationDetails = await organization
      .findOne({ _id: orgId })
      .populate("subscriptionRef");
    const { subscriptionRef } = organizationDetails;
    const { planExpiry } = subscriptionRef[0];
    const todayDate = new Date();
    const isPlanExpired =
      planExpiry.getTime() - todayDate.getTime() > 0 ? false : true;
    if (isPlanExpired) {
      throw "The current subscription of your organization has been expired !";
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
