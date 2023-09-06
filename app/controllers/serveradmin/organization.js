const serverAdminService = require('../../services/serveradmin/organization')
// add/ create organization
exports.addOrganization = function(req, res, next) {
    serverAdminService.addOrganization(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}
// add/ create organization
exports.addNewOrganization = function(req, res, next) {
    let organizationParams = {
      customId: req.body.customId,
      email: req.body.email,
      name: req.body.name,
      orgGithubURL: req.body.orgGithubURL,
      ditaotVersion: req.body.ditaotVersion,
      isDomainVerified: req.body.isDomainVerified,
      isEmailVerified: req.body.isEmailVerified,
      isActive: req.body.isActive,
      accessURL: req.body.accessURL,
      adminHostURL: req.body.adminHostURL,
      userHostURL: req.body.userHostURL,
      docManager: req.body.docManager,
      docMigration: req.body.docMigration,
      docMigrationType: req.body.docMigrationType,
      editor: req.body.editor,
      publisher: req.body.publisher,
      contact: req.body.contact,
      numberofUser: req.body.numberofUser,
      numberofAdmin: req.body.numberofAdmin,
      planId: req.body.planId,
    };
    let adminParams = {
        email: req.body.adminEmail,
        password: req.body.adminPassword,
        name: req.body.adminName,
        githubUsername: req.body.githubUsername,
        isActive: req.body.isActiveAdmin,
        isChangePassword: false,
        contact: req.body.adminContact
    }
    serverAdminService.addNewOrganization(organizationParams, adminParams)
        .then((ress) => res.json(ress))
        .catch(err => next(err))
}
//active organization domain
exports.activeDomain = function(req, res, next) {
    serverAdminService.activeDomain(req.body.id, req.body.token)
        .then((orgDetail) => res.json(orgDetail))
        .catch(err => next(err))
}
//update organization details
exports.updateOrganization = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        serverAdminService.updateOrganization(req.body, orgId)
            .then((orgDetail) => res.json(orgDetail))
            .catch(err => next(err))
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.deactiveOrganization = function(req, res, next) {
    serverAdminService.deactiveOrganization(req.body)
        .then(() => res.json({ message: "organization deactivated" }))
        .catch(err => next(err))
}
exports.activeOrganization = function(req, res, next) {
serverAdminService.activeOrganization(req.body)
    .then(() => res.json({ message: "organization activated" }))
    .catch(err => next(err))
}
// get list of all organization
exports.getOrganization = function(req, res, next) {
    serverAdminService.getOrganization()
        .then(orgDetails => res.json(orgDetails))
        .catch(err => next(err));
}
exports.getOrganizationById = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        serverAdminService.getOrganizationById(orgId)
            .then(orgDetails => res.json(orgDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
// get organization details with project count and collaborators count
exports.getOrganizationDetails = function(req, res, next) {
    let orgId = req.query.orgId
    if(orgId){
        serverAdminService.getOrganizationDetails(orgId)
            .then(orgDetails => res.json(orgDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
exports.sendEmailAppAccess = function(req, res, next) {
    serverAdminService.sendEmailAppAccess(req.body)
        .then(emailDetails => res.json(emailDetails))
        .catch(err => next(err));
}
exports.updateSubscriptionPlan = function(req, res, next) {
    let orgId = req.body.orgId
    let planId = req.body.planId
    let userCount = req.body.numberofUser
    let adminCount = req.body.numberofAdmin
    if(orgId){
        serverAdminService.updateSubscriptionPlan(orgId,planId,userCount,adminCount)
            .then(orgDetails => res.json(orgDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "orgId not found" })
    }
}
// Get serveradmin details by id
exports.getServeradminById = function(req, res, next) {
    let seradminId = req.query.seradminId
    if(seradminId){
        serverAdminService.getServeradminById(seradminId)
            .then(seradminDetails => res.json(seradminDetails))
            .catch(err => next(err));
    }else{
        res.status(404).json({ message: "server admin not found" })
    }
}
// Change Password By ServerAdmin Id
exports.changePasswordByServerAdminId = function(req, res, next) {
    let orgServerAdminId = req.body.orgServerAdminId
    let password = req.body.password
    serverAdminService.changePasswordByServerAdminId(orgServerAdminId, password)
        .then(admin => res.json(admin))
        .catch(err => next(err));
}
// download data of organization in xls format
exports.downloadOrgXls = function (req, res, next) {
  const orgId = req.query.orgId;
  serverAdminService
    .downloadOrgXls(orgId,res)
    .then(() => res.status(200).json({message:"file downloaded successfully"}))
    .catch((err) => next(err));
};