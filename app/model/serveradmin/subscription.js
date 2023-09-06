const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    orgId: { type: String, required: true },
    orgEmail: { type: String, required: true },
    subscribedAt: { type: Date, required: true },
    planExpiry: { type: Date, required: true },
    isPlanActive: { type: Boolean, required: true },
    nextNotificationAt: { type: String, required: true },
    subscriptionPlanRef : [{type:mongoose.Schema.Types.ObjectId , ref:"subscriptionPlan"}]
  },
  { timestamps: true }
);
module.exports = mongoose.model("subscription", schema);
