const db = require('../../config/db')
const SubscriptionPlan = db.subscriptionPlan
module.exports = {
    getSubscriptionPlan,
    getSubscriptionPlanById,
    addSubscriptionPlan,
    updateSubscriptionPlan
};
// add subscription plan
async function addSubscriptionPlan(organizationParam) {
    const plans = new SubscriptionPlan(organizationParam);
    await plans.save();
}
// update subscription plan details
async function updateSubscriptionPlan(organizationParam,id) {
      const filter = { _id: id };
      let update = organizationParam;
      organizationParam.updatedAt = Date.now()
      let doc = await SubscriptionPlan.findOneAndUpdate(filter, update)
      doc = await SubscriptionPlan.findOne(filter);
      return doc
}
// get list of all subscription plans
async function getSubscriptionPlan() {
    return await SubscriptionPlan.find();
}
// get list of all subscription plans by id
async function getSubscriptionPlanById(id) {
    return await SubscriptionPlan.findOne({_id: id});
}