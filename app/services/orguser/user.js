const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../config/db");
const nodemailer = require("nodemailer");
const { v4, v5 } = require("uuid");
const _ = require("lodash");
const { sendMail } = require("../../utilities/sendMail.js");
const User = db.orgUser;
const Admin = db.orgAdmin;
const Project = db.project;
const ProjectUser = db.projectUser;
const organization = db.organization;
const gitAuthToken = db.githubAuthToken;
const orgUserEmailVerifiationToken = db.orgUserEmailVerificationToken;
module.exports = {
  authenticate,
  getUserById,
  getUserGithubCollaboratorId,
  getUsersByOrgId,
  addOrgUser,
  orgUserProfileUpdate,
  emailVerification,
  updateOrgUser,
  sendEmailAppAccess,
  domainVerification,
  getActiveUserProfile,
  getInactiveUserProfile,
  changePasswordBYUserId,
  ActiveInactiveUserProfile,
  validatePlan,
};
// organization user authentication
async function authenticate({ email, password }) {
  try {
    const user = await User.findOne({ email });
    const organizationDetails = await organization.findOne({ _id: user.orgId });
    if (!user) {
      throw "No user exists with given details!";
    }
    const { adminId } = user;
    const adminDetails = await Admin.findOne({ _id: adminId });
    if (!adminDetails || !adminDetails?.isActive) {
      throw "Your respective admin is either not active or no longer exists!";
    }
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    if (user && bcrypt.compareSync(password, user.hash)) {
      const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "7d" });
      await User.findOneAndUpdate(
        { email: user.email },
        { lastLogin: Date.now() }
      );
      let gitTokenDetails = await gitAuthToken.findOne({ userId: user.id });
      let gitToken = "";
      if (gitTokenDetails === null) {
        gitToken = null;
      } else {
        gitToken = gitTokenDetails.token;
      }
      return {
        ...user.toJSON(),
        token,
        gitToken,
      };
    }
  } catch (error) {
    throw error;
  }
}
// Get user by id
async function getUserById(id) {
  return await User.findOne({ _id: id });
}
// Get user by github collaborator id
async function getUserGithubCollaboratorId(id) {
  return await User.findOne({ githubCollaboratorId: id });
}
//Get List of all organization users
async function getUsersByOrgId(id) {
  return await User.find({ orgId: id });
}
// Add organization user
async function addOrgUser(orgUserParam) {
  let orgdata = await organization.findOne({ _id: orgUserParam.orgId });
  for (let index = 0; index < orgdata.numberofUser; index++) {
    let useruuid = v5(orgUserParam.orgId, v4()).toString("hex").slice(0, 6);
    let newUsername = orgdata.name.slice(0, 3) + "user" + (index + 1);
    let dataobj = {
      orgId: orgUserParam.orgId,
      email: "user" + index + "@" + useruuid + ".com",
      password: "123456",
      rawpassword: "123456",
      username: newUsername,
      githubCollaboratorId: "Dummy",
      projects: ["Dummy"],
      githubEmail: "user" + index + "@" + useruuid + ".com",
      githubUsername: "Dummy",
      adminId: "123456",
      lastLoginId: "123456",
      isEmailVerified: false,
      isProfileUpdate: false,
      isRoleAssign: false,
      isActive: "true",
      isDeleted: "false",
      isSuperUser: "false",
    };
    if (await User.findOne({ email: dataobj.email })) {
      throw 'Email "' + dataobj.email + '" is already taken';
    }
    const user = new User(dataobj);
    if (dataobj.password) {
      user.hash = bcrypt.hashSync(dataobj.password, 10);
    }
    await user.save();
  }
}
// Update organization user details
async function updateOrgUser(id, orgUserParam) {
  const user = await User.findById(id);
  // validate
  if (!user) throw "User not found";
  if (
    user.email !== orgUserParam.email &&
    (await User.findOne({ email: orgUserParam.email }))
  ) {
    throw 'Email "' + orgUserParam.email + '" is already taken';
  }
  // // hash password if it was entered
  if (orgUserParam.password) {
    orgUserParam.hash = bcrypt.hashSync(orgUserParam.password, 10);
  }
  orgUserParam.updatedAt = Date.now();
  orgUserParam.isRoleAssign = true;
  await ProjectUser.deleteMany({ userId: id });
  for await (pudata of orgUserParam.projects) {
    let projectData = await Project.findOne({ projectRepoId: pudata });
    let projectUserParams = {
      projectId: projectData._id,
      projectName: projectData.projectName,
      userId: id,
      githubUsername: orgUserParam.githubUsername,
      githubEmail: orgUserParam.githubEmail,
      githubUserId: orgUserParam.githubCollaboratorId,
      userRole: orgUserParam.userRole,
      acceptInvitation: false,
      isActive: true,
      isDeleted: false,
    };
    const projectuser = new ProjectUser(projectUserParams);
    await projectuser.save();
    const subject = "Roles update on project DitaxPresso";
    const mailBody = `<p>Dear ${orgUserParam.username}</p>
                <br/>
                <p>This mail is to notify you that your roles has been updated by your admin on following project.</p>
                <div style="display:flex;">
                    <p style="font-weight:900; margin-right:8px">Project name : </p>
                    <p>${projectData.projectName}</p> 
                </div>
                <div style="display:flex">
                    <p style="margin-right:10px; font-weight:900;">Assigned roles : </p>
                    <p>${orgUserParam.userRole.join(" | ")}</p>
                </div>
                <p style="margin:6px 0px">Sincerely,</p>
                <b style="margin:6px 0px">DITAxPresso Team</b>`;
    await sendMail(orgUserParam.email, subject, mailBody);
  }
  await User.findOneAndUpdate({ _id: id }, orgUserParam);
  return await User.findById(id);
}
async function orgUserProfileUpdate(id, orgUserParam) {
  const user = await User.findById(id);
  const orgDetails = await organization.findOne({_id:user.orgId})
  // validate
  if (!user) throw "User not found";
  if (
    user.email !== orgUserParam.email &&
    (await User.findOne({ email: orgUserParam.email }))
  ) {
    throw 'Email "' + orgUserParam.email + '" is already taken';
  }
  // // hash password if it was entered
  if (orgUserParam.password) {
    orgUserParam.rawpassword = orgUserParam.password;
    orgUserParam.hash = bcrypt.hashSync(orgUserParam.password, 10);
  }
  orgUserParam.updatedAt = Date.now();
  orgUserParam.isProfileUpdate = true;
  orgUserParam.isRoleAssign = true;
  await User.findOneAndUpdate({ _id: id }, orgUserParam)
    .then(async (saveRes) => {
      for await (const projectdata of orgUserParam.projects) {
        let projectRes = await Project.findOne({ projectRepoId: projectdata });
        let projectUserParam = {
          userRole: orgUserParam.userRole,
          projectId: projectRes._id,
          projectName: projectRes.projectName,
          userId: saveRes._id,
          githubProjectId: projectdata,
          githubUsername: orgUserParam.githubUsername,
          githubEmail: orgUserParam.githubEmail,
          githubUserId: orgUserParam.githubCollaboratorId,
          acceptInvitation: false,
          isActive: true,
          isDeleted: false,
        };
        const projectuser = new ProjectUser(projectUserParam);
        await projectuser.save();
        const subject = "New project assgined DitaxPresso";
        const mailBody = `<p>Dear ${orgUserParam.username}</p>
                <br/>
                <p>This mail is to notify you that you have been assigned with new projects by your admin.</p>
                <div style="display:flex;">
                    <p style="font-weight:900; margin-right:8px">Project name : </p>
                    <p>${projectRes.projectName}</p> 
                </div>
                <div style="display:flex">
                    <p style="margin-right:10px; font-weight:900;">Assigned roles : </p>
                    <p>${orgUserParam.userRole.join(" | ")}</p>
                </div>
                <p style="margin:6px 0px">Sincerely,</p>
                <b style="margin:6px 0px">DITAxPresso Team</b>`;
        await sendMail(orgUserParam.email, subject, mailBody);
      }

      const secret =
        "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
      const token = jwt.sign({ sub: saveRes._id }, secret, { expiresIn: "7d" });
      let dataObj = {
        email: orgUserParam.email,
        token: token,
        orgUserId: saveRes._id,
        purpose: "verify token",
      };
      const emailVerifiationToken = new orgUserEmailVerifiationToken(dataObj);
      await emailVerifiationToken.save();
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "lolstudent002@gmail.com",
          pass: "lizgqntmkddjdnoe",
        },
      });
      let mailOptions = {
        from: "lolstudent002@gmail.com",
        to: orgUserParam.email,
        subject: "Verify your identity",
        html: `<div>
                    <p style="margin:24px 0px">Dear user,</p>
                    <p style="margin:6px 0px">Please verify your identity by clicking this <a style="background-color:#4374E0;color:white;display:inline-flex;padding:0px 3px;letter-spacing:0.5px" href=${orgDetails.userHostURL}verify/${token}>link</a>.Your Technical Publication Administrator has added you to DITAxPresso projects.</p>
                    <p style="margin:24px 0px">Do not reply to this automated email.</p>
                    <p style="margin:6px 0px">Sincerely,</p>
                    <b style="margin:6px 0px">DITAxPresso Team</b>
                <div>`,
      };
      await transporter.sendMail(mailOptions);
    })
    .catch((err) => {
      return err;
    });
  return await User.findById(id);
}

// organization user email verification
async function emailVerification(token) {
  try {
    let tokenObj = await orgUserEmailVerifiationToken.findOne({ token });
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    if (tokenObj) {
      jwt.verify(token, secret, async function (err, decoded) {
        if (decoded) {
          let userData = await User.findOne({ _id: tokenObj.orgUserId });
          const orgDetails = await organization.findOne({_id:userData.orgId})
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "lolstudent002@gmail.com",
              pass: "lizgqntmkddjdnoe",
            },
          });
          let mailOptions = {
            from: "lolstudent002@gmail.com",
            to: userData.email,
            subject: "Now you are ready to access your DITAxPresso!",
            html: `<div>
                                <p style="margin:22px 0px">We’re excited to have you as part of the DITAxPresso family!</p>
                                <p style="margin:22px 0px">Create your first DITA publication using the most simple DITA-XML interop utility software on the planet. All it takes is DITA source files, and voila! you have DITA documents ready to publish in the PDF or HTML output at your fingertips.</p>
                                <p style="margin:22px 0px">But don’t take our word for it. Create your next PDF or HTML with us in a few minutes.</p>
                                <p style="margin:24px 0px">Visit this <a style="background-color:#4374E0;color:white;display:inline-flex;padding:0px 3px;letter-spacing:0.5px" href="${orgDetails.userHostURL}">link</a> to access your DITAxPresso DocManager to access your projects.</p>
                                <p style="margin:6px 0px">Sincerely,</p>
                                <b style="margin:6px 0px">DITAxPresso Team</b>
                            <div>`,
          };
          await transporter.sendMail(mailOptions);
          await User.findOneAndUpdate(
            { _id: tokenObj.orgUserId },
            { rawpassword: null, isEmailVerified: true }
          );
        }
      });
    }
  } catch (err) {
    return err;
  }
}
async function sendEmailAppAccess(emailParams) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lolstudent002@gmail.com",
        pass: "lizgqntmkddjdnoe",
      },
    });
    const user = await User.findOne({email:emailParams.email})
    const orgDetails = await organization.findOne({_id:user.orgId})
    let mailOptions = {
      from: "lolstudent002@gmail.com",
      to: emailParams.email,
      subject: "Now you are ready to access your DITAxPresso!",
      html: `<div>
                    <p style="margin:22px 0px">We’re excited to have you as part of the DITAxPresso family!</p>
                    <p style="margin:22px 0px">Create your first DITA publication using the most simple DITA-XML interop utility software on the planet. All it takes is DITA source files, and voila! you have DITA documents ready to publish in the PDF or HTML output at your fingertips.</p>
                    <p style="margin:22px 0px">But don’t take our word for it. Create your next PDF or HTML with us in a few minutes.</p>
                    <p style="margin:24px 0px">Visit this <a style="background-color:#4374E0;color:white;display:inline-flex;padding:0px 3px;letter-spacing:0.5px" href="${orgDetails.userHostURL}">link</a> to access your DITAxPresso DocManager to access your projects.</p>
                    <p style="margin:6px 0px">Sincerely,</p>
                    <b style="margin:6px 0px">DITAxPresso Team</b>
                <div>`,
    };
    let ressendmail = transporter.sendMail(mailOptions);
    return ressendmail;
  } catch (err) {
    return err;
  }
}
// organization user domain verification
async function domainVerification(email, domainName) {
  let userObj = await User.findOne({ email });
  let orgObj = await organization.findOne({ _id: userObj.orgId });
  if (orgObj.isActive && orgObj.accessURL === domainName) {
    return await userObj;
  } else {
    return await { message: "User access blocked" };
  }
}
// Get active users by profile
async function getActiveUserProfile(id) {
  let userData = await User.find({ orgId: id, isProfileUpdate: true });
  let userDataArr = [];
  for await (const udata of userData) {
    let adminData = await Admin.findOne({ _id: udata.adminId });
    let newObj = {
      adminName: adminData.name,
      projects: udata.projects,
      userRole: udata.userRole,
      id: udata._id,
      orgId: udata.orgId,
      email: udata.email,
      username: udata.username,
      githubCollaboratorId: udata.githubCollaboratorId,
      githubEmail: udata.githubEmail,
      githubUsername: udata.githubUsername,
      adminId: udata.adminId,
      lastLoginId: udata.lastLoginId,
      isEmailVerified: udata.isEmailVerified,
      isProfileUpdate: udata.isProfileUpdate,
      isRoleAssign: udata.isRoleAssign,
      isActive: udata.isActive,
      isDeleted: udata.isDeleted,
      isSuperUser: udata.isSuperUser,
      lastLogin: udata.lastLogin,
      createdAt: udata.createdAt,
      updatedAt: udata.updatedAt,
      hash: udata.hash,
      __v: udata.__v,
    };
    userDataArr.push(newObj);
  }
  return await userDataArr;
}
// Get inactive users by profile
async function getInactiveUserProfile(id) {
  return await User.find({ orgId: id, isProfileUpdate: false });
}
// Chnage Password By USer Id
async function changePasswordBYUserId(userId, password) {
  let userData = await User.findOne({ _id: userId });
  return await User.findOneAndUpdate(
    { _id: userId },
    { hash: bcrypt.hashSync(password, 10) }
  );
}
// Active inactive users by profile
async function ActiveInactiveUserProfile(userId, isActive) {
  await User.findOneAndUpdate({ _id: userId }, { isActive: isActive });
  return await User.findOne({ _id: userId });
}
// validate if user's organization has an active/not expired plan
async function validatePlan(orgId) {
  try {
    const organizationDetails = await organization
      .findOne({ _id: orgId })
      .populate("subscriptionRef");
    const { subscriptionRef } = organizationDetails;
    const { planExpiry } = subscriptionRef[0];
    const todayDate = new Date();
    const isPlanExpired =
      planExpiry.getTime() - todayDate.getTime() > 0 ? false : true;
    if (isPlanExpired) {
      throw "The current subscription of your organization has been expired. Please ask your organization to renew the subscription plan to use our services again. Thank you!";
    }
    return { message: "subscription plan still active!" };
  } catch (error) {
    throw error;
  }
}
