// const config = require('config.json');
const mongoose = require('mongoose');
const scheduler = require("node-schedule")
const { sendSubscriptionRenewalNotification } = require('../utilities/clientadmin/sendsubscriptionrenewalnotification');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
// const connectionString = "mongodb+srv://root:root@ditaxpressocluster.uxanz.mongodb.net/Ditaxpresso?retryWrites=true&w=majority"

// Final Database String (amit.siddhartha@ditaxpresso.com)
// const connectionString = "mongodb+srv://root:root@ditaxpresso.7nh66.mongodb.net/Ditaxpresso?retryWrites=true&w=majority"

//Test Database String (vedantika.g@ditaxpresso.com)
const connectionString = "mongodb+srv://root:root@cluster0.o8ujdlx.mongodb.net/Ditaxpresso?retryWrites=true&w=majority"

// const connectionString = "mongodb://0.0.0.0:27017"
mongoose.connect(process.env.MONGODB_URI || connectionString, connectionOptions).then(()=>{
    scheduler.scheduleJob("00 18 * * *",()=>{
        sendSubscriptionRenewalNotification()
    })
})
mongoose.Promise = global.Promise;

module.exports = {
    serverAdmin: require('../model/serveradmin/auth'),
    organization: require('../model/serveradmin/organization'),
    subscriptionPlan: require('../model/serveradmin/subscriptionplan'),
    ditaotVersion: require('../model/serveradmin/ditaotversions'),
    activeDeactiveOrg: require('../model/serveradmin/activedeactiveorg'),
    domainVerificationToken: require('../model/serveradmin/domainverificationtoken'),
    githubAuthToken: require('../model/githubauthtoken/authtoken'),
    orgUserEmailVerificationToken: require('../model/orguser/orguseremailverificationtoken'),
    orgAdminEmailVerificationToken: require('../model/orgadmin/orgadminamailaerificationtoken'),
    githubCollaborators: require('../model/orgadmin/github/gitcollaborators'),
    orgAdmin: require('../model/orgadmin/appauth'),
    orgUser: require('../model/orguser/user'),
    pluginDetails: require('../model/orgadmin/plugindetails'),
    orgUserWorkspace: require('../model/orguser/orguserworkspace'),
    project: require('../model/project/project'),
    projectUser: require('../model/project/projectuser'),
    Admin: require('../model/orgadmin/appauth'),
    CMSUser: require('../model/cmsuser/appauth'),
    User: require('../model/appauth'),
    projectDetails: require('../model/projectDetails'),
    // projectUser: require('../model/orgadmin/appgituser'),
    gits3data: require('../model/aws-sdk/aws-s3'),
    githubtrepoevent: require('../model/gitrepoevent'),
    release : require("../model/orguser/docpublisher/releaseTable.js"),
    subscriptions : require("../model/serveradmin/subscription.js")
};