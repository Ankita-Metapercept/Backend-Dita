const db = require('../../config/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const { v4, v5 } =  require('uuid');
const Excel = require("exceljs");
const { sendMail } = require('../../utilities/sendMail');
const Organization = db.organization
const ActiveDeactiveOrg = db.activeDeactiveOrg
const OrgUser = db.orgUser
const OrgAdmin = db.orgAdmin
const Project = db.project
const GithubCollaborators = db.githubCollaborators
const DomainVerificationToken = db.domainVerificationToken
const EmailVerifiationToken = db.orgAdminEmailVerificationToken
const ServerAdmin = db.serverAdmin
const SubscriptionPlan = db.subscriptionPlan;
const subscriptions = db.subscriptions
module.exports = {
  getOrganization,
  addOrganization,
  addNewOrganization,
  updateOrganization,
  activeOrganization,
  deactiveOrganization,
  getOrganizationById,
  activeDomain,
  sendEmailAppAccess,
  updateSubscriptionPlan,
  getOrganizationDetails,
  getServeradminById,
  changePasswordByServerAdminId,
  downloadOrgXls,
};
// add organization 
async function addOrganization(organizationParam) {
    const organization = new Organization(organizationParam);
    let res = await organization.save();
    console.log(res)
    Organization.findOneAndUpdate({_id: res._id },{$inc:{customId: 2}}
     ).then((ress)=>{
        console.log(ress)
     }).catch((err)=> {
        console.log(err)
     })
     return res
}
// add organization 
async function addNewOrganization(organizationParam, adminParams) {
    try{
        const { email, planId } = organizationParam;
        let ramdomNum = Math.floor(Math.random()*(999-100+1)+100)
        let orgName = organizationParam.name.split(' ')[0]
        organizationParam.customId = `${orgName}`+`${ramdomNum}`+`DM`
        const organization = new Organization(organizationParam);
        const { _id: orgId } = organization;
        const subscribedAt = new Date();
        const planExpiry = new Date(subscribedAt.getTime() + 365 * 24 * 60 * 60 * 1000);
        const nextNotificationAt = new Date(
            planExpiry.getTime() - 6 * 7 * 24 * 60 * 60 * 1000
        ).toDateString();
        const subscriptionParams = {
                orgEmail: email,
                orgId,
                subscribedAt,
                planExpiry,
                nextNotificationAt,
                isPlanActive: true,
                subscriptionPlanRef : [planId]
            };
        const newSubscription = new subscriptions(subscriptionParams);
        const {_id:subscriptionRef} = newSubscription
        organization._doc.subscriptionRef.push(subscriptionRef)
        let res = await organization.save()
        await newSubscription.save()
        adminParams.orgId = res.id
        try{
            if (await OrgAdmin.findOne({ email: adminParams.email })) {
                throw 'Email "' + adminParams.email + '" is already taken';
            }
            adminParams.rawpassword = adminParams.password
            adminParams.isEmailVerified = false
            const orgadmin = new OrgAdmin(adminParams);
            // hash password
            if (adminParams.password) {
                orgadmin.hash = bcrypt.hashSync(adminParams.password, 10);
            }
            let resadmin = await orgadmin.save()
                try{
                    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
                    const token = jwt.sign({ sub: resadmin.id }, secret, { expiresIn: '7d' })
                    let dataObj = {
                        email: resadmin.email,
                        token: token,
                        orgAdminId: resadmin.id,
                        purpose: "verify token"
                    }
                    const emailVerifiationToken = new EmailVerifiationToken(dataObj)
                    await emailVerifiationToken.save()
                        try{
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                user: 'lolstudent002@gmail.com',
                                pass: 'lizgqntmkddjdnoe'
                                }
                            });
                            let mailOptions = {
                                from: 'lolstudent002@gmail.com',
                                to: orgadmin.email,
                                subject: "We are excited to welcome you",
                                html: `<div><h4>Welcome to the DITAxPresso.</h4> <br>To verify your email <a href=${organizationParam.adminHostURL}verify/${token}>Click Here</a>.<br><br>Thanks for making DITAxPress a part of your publishing process! We would love to hear about your experience with DITAxPresso.<div>`
                            };
                            let ressendmail = transporter.sendMail(mailOptions)
                            return res
                        }catch(err){
                            console.log(err)
                        }
            }catch(err){
                return err
            }
        }catch(err){
            return err 
        }
    }catch(err){
        return err
    }
}
// active organization domain
async function activeDomain(id, token) {
    try{
        let res = await DomainVerificationToken.findOne({_id: id, token: token})
        if(res){
            const filter = { _id: res.orgId };
            let update = {isDomainVerified: true};
            let doc = await Organization.findOneAndUpdate(filter, update)
            doc = await Organization.findOne(filter);
            return doc
        }
    }catch(err){
        console.log(err)
    }
}
// update organization
async function updateOrganization(organizationParam,id) {
      const filter = { _id: id };
      let update = organizationParam;
      organizationParam.updatedAt = Date.now()
      let doc = await Organization.findOneAndUpdate(filter, update)
      doc = await Organization.findOne(filter);
      const subject = "Organization details updated DitaxPresso"
      const mailBody = `<p>Dear ${organizationParam.name} Team,</p>
                    <br/>
                    <div>Your organization details has been updated by the server admin, and your current details are as follows.</div>
                    <div style="display:flex;">
                        <p style="font-weight:bold; margin:6px 0px">Organization email : </p>
                        <p style="margin:6px 0px">${organizationParam.email}</p>
                    </div>
                    <div style="display:flex;">
                        <p style="font-weight:bold;margin:6px 0px">Contact : </p>
                        <p style="margin:6px 0px">${organizationParam.contact}</p>
                    </div>
                    <div style="display:flex;">
                        <p style="font-weight:bold;margin:6px 0px">Domain : </p>
                        <p style="margin:6px 0px">${organizationParam.accessURL}</p>
                    </div>
                    <div style="display:flex;">
                        <p style="font-weight:bold;margin:6px 0px">Dita-ot version : </p>
                        <p style="margin:6px 0px">${organizationParam.ditaotVersion}</p>
                    </div>
                    <div style="display:flex;">
                        <p style="font-weight:bold;margin:6px 0px">App access : </p>
                        <p style="margin:6px 0px">${organizationParam.editor?"Editor | ":"" }
                            ${organizationParam.docManager?"docManager | ":"" }
                            ${organizationParam.docMigration?"docMigration | ":"" }
                            ${organizationParam.publisher?"Publisher":"" }
                        </p>
                    </div>
                    <div style="display:flex;">
                        <p style="font-weight:bold;margin:6px 0px">Doc Migration type : </p>
                        <p style="margin:6px 0px">${organizationParam.docMigrationType}</p>
                    </div>
                    <p style="margin:6px 0px;margin-top:16px">Sincerely,</p>
                    <b style="margin:6px 0px">DITAxPresso Team</b>`
      await sendMail(organizationParam.email,subject,mailBody)
      return doc
}
// Deactive organization
async function deactiveOrganization(reqObj) {
    let id = reqObj.orgId
    let userData = await OrgUser.find({orgId: id})
    let adminData = await OrgAdmin.find({orgId: id})
    for (let index = 0; index < userData.length; index++) {
        let element = userData[index];
        let filter = { _id: element.id };
        let update = {isActive: false}
        await OrgUser.findOneAndUpdate(filter, update)
    }
    for (let index = 0; index < adminData.length; index++) {
        let element = adminData[index];
        let filter = { _id: element.id };
        let update = {isActive: false}
        await OrgAdmin.findOneAndUpdate(filter, update)
    }
    reqObj.isActive = false
    const activeDeactiveOrg = new ActiveDeactiveOrg(reqObj);
    await activeDeactiveOrg.save()
    await Organization.findOneAndUpdate({ _id: id }, {isActive: false})
}
// Active organization
async function activeOrganization(reqObj) {
    let id = reqObj.orgId
    let userData = await OrgUser.find({orgId: id})
    let adminData = await OrgAdmin.find({orgId: id})
    for (let index = 0; index < userData.length; index++) {
        let element = userData[index];
        let filter = { _id: element.id };
        let update = {isActive: true}
        await OrgUser.findOneAndUpdate(filter, update)
    }
    for (let index = 0; index < adminData.length; index++) {
        let element = adminData[index];
        let filter = { _id: element.id };
        let update = {isActive: true}
        await OrgAdmin.findOneAndUpdate(filter, update)
    }
    reqObj.isActive = true
    const activeDeactiveOrg = new ActiveDeactiveOrg(reqObj);
    await activeDeactiveOrg.save()
    await Organization.findOneAndUpdate({ _id: id }, {isActive: true})
}
// get list of all organization
async function getOrganization() {
    return await Organization.find();
}
// get organization details by id
async function getOrganizationById(id) {
    return await Organization.find({_id: id});
}
// get organization details with project count and collaborators count
async function getOrganizationDetails(orgId) {
    try{
        let orgData = await Organization.findOne({_id: orgId});
        let projectData = await Project.find({ orgId: orgId });
        let collaboratorsData = await GithubCollaborators.find({ orgId: orgId })
        let orgDetails ={
            fileCount: orgData.fileCount,
            customId: orgData.customId,
            email: orgData.email,
            name: orgData.name,
            orgGithubURL: orgData.orgGithubURL,
            ditaotVersion: orgData.ditaotVersion,
            isDomainVerified: orgData.isDomainVerified,
            isEmailVerified: orgData.isEmailVerified,
            isActive: orgData.isActive,
            accessURL: orgData.accessURL,
            docManager: orgData.docManager,
            editor: orgData.editor,
            publisher: orgData.publisher,
            contact: orgData.contact,
            numberofUser: orgData.numberofUser,
            numberofAdmin: orgData.numberofAdmin,
            planId: orgData.planId,
            createdAt: orgData.createdAt,
            updatedAt: orgData.updatedAt,
            id: orgData._id,
            projectCount: projectData.length,
            collaboratorsCount: collaboratorsData.length
        }
        return await orgDetails
    }
    catch(err){
        return err
    }
}
// send email for app access 
async function sendEmailAppAccess(emailParams) {
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'lolstudent002@gmail.com',
              pass: 'lizgqntmkddjdnoe'
            }
          });
        let mailOptions = {
        from: 'lolstudent002@gmail.com',
        to: emailParams.email,
        subject: "Access your APP",
        html: `<div>Welcome to the DITAxPresso. Here is the link to access the app <a href=${emailParams.appURL}>Click Here</a>.<br><br>Email: ${emailParams.email}<br>
        Password: ${emailParams.password} <br><br> Let’s get started to enhance the process and experience of your end user with the customized publishing of the documents. <br><br>Thank you for choosing DITAxPresso as your document styling and publishing partner. We would love to hear about your experience. <div>`
        };
        let ressendmail = transporter.sendMail(mailOptions)
        return ressendmail
    }catch(err){
        return err
    }
}
// Update Subscription Plan
async function updateSubscriptionPlan(orgId, planId, userCount, adminCount) {
    let orgData = await Organization.findOne({_id: orgId})
    let prevUserCount = orgData.numberofUser
    if(prevUserCount < userCount){
        let orgUpdatedData = await Organization.findOneAndUpdate({ _id: orgId }, {planId: planId, numberofUser: userCount, numberofAdmin: adminCount })
        const newUserCount = userCount - prevUserCount
        let orgdata =  await Organization.findOne({_id: orgId})
        if(orgUpdatedData){
            for (let index = 0; index < newUserCount; index++) {
                let useruuid = v5(orgId ,v4())
                let newUsername = orgdata.name.slice(0, 3)+"user"+(index+1+prevUserCount)
                let dataobj = {
                    orgId: orgId, 
                    email: "user"+index+"@"+useruuid+".com",
                    password: "123456",
                    username: newUsername,
                    githubCollaboratorId: "Dummy",
                    projects: ["Dummy"],
                    githubUsername: "Dummy",
                    githubEmail: "user"+index+"@"+useruuid+".com",
                    adminId: "123456",
                    lastLoginId: "123456",
                    isRoleAssign: false,
                    isProfileUpdate: false,
                    isActive: "true",
                    isDeleted: "false",
                    isSuperUser: "false"
                }
                if (await OrgUser.findOne({ email: dataobj.email })) {
                    throw 'Email "' + dataobj.email + '" is already taken';
                }
                const user = new OrgUser(dataobj)
                if (dataobj.password) {
                    user.hash = bcrypt.hashSync(dataobj.password, 10);
                }
                await user.save()
            }
            return await Organization.findOne({_id: orgId})
        }
    }
}
// Get serveradmin details by id
async function getServeradminById(seradminId) {
    return await ServerAdmin.findOne({_id: seradminId});
}
// Change Password By ServerAdmin Id
async function changePasswordByServerAdminId(orgServerAdminId, password) {
    return await ServerAdmin.findOneAndUpdate({ _id: orgServerAdminId }, {hash: bcrypt.hashSync(password, 10)}) 
}
// download data of organization in xls format
async function downloadOrgXls(orgId,res){
    try {
        const orgDetails = await Organization.findOne({_id:orgId});
        const filename = orgDetails.name+" details.xlsx";
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(orgDetails.name+" details");
        worksheet.columns = [
          { header: "Custom ID", key: "customId" },
          { header: "Email", key: "email" },
          { header: "Name", key: "name" },
          { header: "Organization's github URL", key: "orgGithubURL" },
          { header: "Dita OT version", key: "ditaotVersion" },
          { header: "Contact number", key: "contact" },
          { header: "No. of users", key: "numberofUser" },
          { header: "No. of admins", key: "numberofAdmin" },
          { header: "Plan Name", key: "planTitle" },
        ];
        const planDetails = await SubscriptionPlan.findOne({_id:orgDetails.planId});
        orgDetails._doc.planTitle = planDetails.title
        const data = [orgDetails._doc]
        // adding data in new row in excel sheet
        data.forEach((e) => {
          worksheet.addRow(e);
        });
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + filename
        );
        await workbook.xlsx.write(res);
    } catch (error) {
        throw error
    }
}