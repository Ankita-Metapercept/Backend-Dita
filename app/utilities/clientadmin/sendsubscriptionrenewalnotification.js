const subscriptions = require("../../model/serveradmin/subscription.js");
const orgAdmin = require("../../model/orgadmin/appauth.js");
const { sendMail } = require("../sendMail.js");
exports.sendSubscriptionRenewalNotification = async function () {
  try {
    const todayDate = new Date().toDateString();
    const subscriptionList = await subscriptions.find({
      nextNotificationAt: todayDate,
    });
    for (const subscriptionDetails of subscriptionList) {
      const { planExpiry, orgEmail, orgId } = subscriptionDetails;
      const { remainingWeeks, remainingDays } = getRemainingWeeks(
        new Date(),
        planExpiry
      );
      const adminList = await orgAdmin.find({ orgId });
      const adminEmailsList = adminList.map(
        (adminDetails) => adminDetails.email
      );
      adminEmailsList.push(orgEmail)
      if (remainingWeeks <= 6 && remainingWeeks > 0) {
        const subject = "subscription plan renewal notification";
        sendMail(
          adminEmailsList,
          subject,
          `Please update your subscription plan, you have only ${
            remainingDays < 7 && remainingDays > 0
              ? remainingDays + " days"
              : remainingWeeks + " weeks"
          } left to work with current subscription plan!`
        );
        console.log("Subscription notification mail sent to ", adminEmailsList);
        setNextNotificationDate(remainingWeeks, subscriptionDetails);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

async function setNextNotificationDate(remainingWeeks, subscriptionDetails) {
  try {
    if (remainingWeeks <= 6 && remainingWeeks >= 3) {
      let { nextNotificationAt, _id } = subscriptionDetails;
      nextNotificationAt = new Date(
        new Date(nextNotificationAt).getTime() + 7 * 24 * 60 * 60 * 1000
      )
        .toDateString()
        .trim();
      await subscriptions.findOneAndUpdate({ _id }, { nextNotificationAt });
    } else if (remainingWeeks === 2) {
      let { nextNotificationAt, _id } = subscriptionDetails;
      nextNotificationAt = new Date(
        new Date(nextNotificationAt).getTime() + 4 * 24 * 60 * 60 * 1000
      )
        .toDateString()
        .trim();
      await subscriptions.findOneAndUpdate({ _id }, { nextNotificationAt });
    } else if (remainingWeeks === 1) {
      let { nextNotificationAt, _id } = subscriptionDetails;
      nextNotificationAt = new Date(
        new Date(nextNotificationAt).getTime() + 1 * 24 * 60 * 60 * 1000
      )
        .toDateString()
        .trim();
      await subscriptions.findOneAndUpdate({ _id }, { nextNotificationAt });
    }
  } catch (error) {
    console.log(error);
  }
}

function getRemainingWeeks(currentDate, planExpiry) {
  try {
    const timeDiff = planExpiry.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return { remainingWeeks: Math.ceil(diffDays / 7), remainingDays: diffDays };
  } catch (error) {
    console.log(error);
  }
}
