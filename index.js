const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require('./app/config/error-handler');
const cors = require("cors");
const jwt = require('./app/config/jwt');
const {validateSessionId} = require("./app/config/middlewares/validatesessionid.js")
const {validateSubscriptionPlan} = require("./app/config/middlewares/validatesubscriptionplan.js")
const app = express()

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(validateSessionId)
app.set('view engine', 'ejs')
const appAuthRoutes = require("./app/routes/appauth")
const serverAdminAuthRoutes = require("./app/routes/serveradmin/auth")
const serverAdminOrganizationRoutes = require("./app/routes/serveradmin/organization")
const subscriptionPlanRoutes = require("./app/routes/serveradmin/subscriptionplan")
const ditaotVersionRoutes = require("./app/routes/serveradmin/ditaotversions")
const githubAuthTokenRoutes = require("./app/routes/githubauthtoken/authtoken")
const orgAdminGithubCollaborators = require("./app/routes/orgadmin/github/gitcollaborators")
const orgAdminAppAuthRoutes = require("./app/routes/orgadmin/appauth")
const orgAdminAddUserRoute = require("./app/routes/orgadmin/appgituser")
const orgAdminProjectRoute = require("./app/routes/orgadmin/project")
const pluginRoute = require("./app/routes/orgadmin/plugindetails")
const orgUserAppAuthRoutes = require("./app/routes/orguser/user")
const orgUserWorkspaceRoutes = require("./app/routes/orguser/orguserworkspace")
const orgUserDocPublisherRoutes = require("./app/routes/orguser/docpublisher/docpublish")
const releaseTable = require("./app/routes/orguser/docpublisher/releaseTable");
const projectRoutes = require("./app/routes/project/project")
const projectUserRoutes = require("./app/routes/project/projectuser")
const cmsuserAppAuthRoutes = require("./app/routes/cmsuser/appauth")
const adminApplistenRoutes = require("./app/routes/orgadmin/applisten")
const orgAdminGitauthRoutes = require("./app/routes/orgadmin/github/gitauth")
const orgAdminGitrepoRoute = require("./app/routes/orgadmin/github/gitrepo")
const orgUserGitauthRoutes = require("./app/routes/orguser/github/gitauth")
const orgUserGitrepoRoute = require("./app/routes/orguser/github/gitrepo")
const gitAuthRoutes = require("./app/routes/github/gitauth")
const gitRepoRoute = require("./app/routes/github/gitrepo")
const sendmail = require("./app/routes/sendmail")
const projectDetailsRoutes = require("./app/routes/projectDetails")
// const projectUserRoutes = require("./app/routes/projectUser")
const githubRepoDetails = require("./app/routes/githubrepodetails")
const githubTree = require("./app/routes/githubtree")
const githubRepoReleaseDetails = require("./app/routes/gitreporeleasedetails")
const awss3 = require("./app/routes/aws-sdk/aws-s3")
const gits3data = require("./app/routes/aws-sdk/gits3data")
const githubEvent = require("./app/routes/githubrepoevent")
const wordToDita = require("./app/routes/orguser/docmigration/wordtodita.js");
const orgadminDashboardNotifications = require("./app/routes/orgadmin/notification.js")
const docstyler = require("./app/routes/orguser/docstyler/docstyle.js")
const doceditor = require("./app/routes/orguser/doceditor/doceditor.js")
// app.use(jwt());
app.use('/api', serverAdminAuthRoutes)
app.use('/api', serverAdminOrganizationRoutes)
app.use('/api', subscriptionPlanRoutes)
app.use('/api', ditaotVersionRoutes)
app.use('/api', githubAuthTokenRoutes)
app.use('/api',validateSubscriptionPlan, orgAdminGithubCollaborators)
app.use('/api',validateSubscriptionPlan, orgAdminAppAuthRoutes)
app.use('/api',validateSubscriptionPlan, orgAdminAddUserRoute)
app.use('/api',validateSubscriptionPlan, orgAdminProjectRoute)
app.use('/api', pluginRoute)
app.use('/api',validateSubscriptionPlan, orgUserAppAuthRoutes)
app.use('/api',validateSubscriptionPlan, orgUserWorkspaceRoutes)
app.use('/api',validateSubscriptionPlan, orgUserDocPublisherRoutes)
app.use('/api',validateSubscriptionPlan,releaseTable)
app.use('/api', projectRoutes)
app.use('/api', projectUserRoutes)
app.use('/api', appAuthRoutes)
app.use('/api', cmsuserAppAuthRoutes)
app.use('/api',validateSubscriptionPlan, adminApplistenRoutes)
app.use('/api', gitAuthRoutes)
app.use('/api', gitRepoRoute)
app.use('/api', orgAdminGitauthRoutes)
app.use('/api',validateSubscriptionPlan, orgAdminGitrepoRoute)
app.use('/api', orgUserGitauthRoutes)
app.use('/api',validateSubscriptionPlan, orgUserGitrepoRoute)
app.use('/api',validateSubscriptionPlan, projectDetailsRoutes)
app.use('/api',validateSubscriptionPlan, githubRepoDetails)
app.use('/api',validateSubscriptionPlan, githubRepoReleaseDetails)
// app.use('/api', projectUserRoutes)
app.use('/api',validateSubscriptionPlan, githubTree)
app.use('/api', sendmail)
app.use('/api', awss3)
app.use('/api', gits3data)
app.use('/api', githubEvent)
app.use('/api',validateSubscriptionPlan,wordToDita)
app.use("/api",validateSubscriptionPlan, orgadminDashboardNotifications);
app.use("/api",validateSubscriptionPlan,docstyler)
app.use("/api",validateSubscriptionPlan,doceditor)

app.use(errorHandler);

const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});