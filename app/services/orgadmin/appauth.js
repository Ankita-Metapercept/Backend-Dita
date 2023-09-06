const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../config/db");
const { sendMail } = require("../../utilities/sendMail");
const Admin = db.orgAdmin;
const User = db.githubAuthToken
const Organization = db.organization
const EmailVerifiationToken = db.orgAdminEmailVerificationToken
module.exports = {
  authenticate,
  addOrgAdmin,
  getAll,
  getOrgAdminById,
  getOrgAdminByOrgId,
  updateOrgAdmin,
  domainVerification,
  emailVerification,
  changePassword,
  forgotPassword,
  forgotPasswordTokenVerify,
  resetpassword,
  ActiveInactiveAdminProfile,
  changePasswordByAdminId,
  resetForgotPassword,
};
// organization admin authentication
async function authenticate({ email, password }) {
  const user = await Admin.findOne({ email });
  const organizationDetails = await Organization.findOne({_id:user.orgId})
  const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
    await Admin.findOneAndUpdate({email: user.email}, {lastLogin: Date.now()})
    let gitTokenDetails = await User.findOne({ userId: user.id })
    let gitToken = ''
    if(gitTokenDetails === null){
      gitToken = null
    }else{
      gitToken = gitTokenDetails.token
    }
    return {
      ...user.toJSON(),
      token,
      gitToken,
    };
  }
}
// Add organization admin
async function addOrgAdmin(orgAdminParam) {
  try{
    orgAdminParam.rawpassword = orgAdminParam.password
    orgAdminParam.isEmailVerified = false
    if (await Admin.findOne({ email: orgAdminParam.email })) {
      throw 'Email "' + orgAdminParam.email + '" is already taken';
    }
    const user = new Admin(orgAdminParam);
    // hash password
    if (orgAdminParam.password) {
      user.hash = bcrypt.hashSync(orgAdminParam.password, 10);
    }
    // save user
    let resdata = await user.save();
    const orgDetails = await Organization.findOne({_id:user.orgId})
    const secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET"
    const token = jwt.sign({ sub: resdata.id }, secret, { expiresIn: '30m' })
    let dataObj = {
      email: resdata.email,
      token: token,
      orgAdminId: resdata.id,
      purpose: "verify token"
    }
    const emailVerifiationToken = new EmailVerifiationToken(dataObj)
    await emailVerifiationToken.save()
    const mailTo = [resdata.email];
    const subject = "Verify your identity";
    const mailBody = `<div>
                        <p style="margin:24px 0px">Dear user,</p>
                        <p style="margin:6px 0px">Please verify your identity by clicking this <a style="background-color:#4374E0;color:white;display:inline-flex;padding:0px 3px;letter-spacing:0.5px" href=${orgDetails.adminHostURL}verify/${token}>link</a></p>
                        <p style="margin:6px 0px">You can only use it once and it will expire after 30 minutes. Please don't worry about this email, and contact our helpdesk if you did not request this.</p>
                        <p style="margin:24px 0px">Do not reply to this automated email.</p>
                        <p style="margin:6px 0px">Sincerely,</p>
                        <b style="margin:6px 0px">DITAxPresso Team</b>
                    <div>`;
    let ressendmail = await sendMail(mailTo,subject,mailBody);
    return ressendmail
  }catch(err){
    throw err
  }
}
// Get List of all organization admin
async function getAll() {
  return await Admin.find();
}
// Get List of organization admin by id
async function getOrgAdminById(userId) {
  return await Admin.find({ _id: userId });
}
// Get List of organization admin by orgnization id
async function getOrgAdminByOrgId(orgId) {
  return await Admin.find({ orgId: orgId });
}
// Update organization Admin details
async function updateOrgAdmin(id, orgAdminParam) {
  const admin = await Admin.findById(id);
  // validate
  if (!admin) throw "Admin not found";
  if (
    admin.email !== orgAdminParam.email &&
    (await Admin.findOne({ email: orgAdminParam.email }))
  ) {
    throw 'Email "' + orgAdminParam.email + '" is already taken';
  }
  // hash password if it was entered
  if (orgAdminParam.password) {
    orgAdminParam.hash = bcrypt.hashSync(orgAdminParam.password, 10);
  }
  orgAdminParam.updatedAt = Date.now();
  Object.assign(admin, orgAdminParam);
  await admin.save();
  return await Admin.findById(id);
}
// organization admin domain verification
async function domainVerification(email, domainName) {
  let adminObj = await Admin.findOne({ email });
  let orgObj = await Organization.findOne({ _id: adminObj.orgId });
  if (orgObj.isActive && orgObj.accessURL === domainName) {
    return await adminObj;
  } else {
    return await { message: "Admin access blocked" };
  }
}
// organization admin email verification
async function emailVerification(token) {
  try {
    let tokenObj = await EmailVerifiationToken.findOne({ token });
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    if (tokenObj) {
      jwt.verify(token, secret, async function (err, decoded) {
        if (decoded) {
          let adminData = await Admin.findOne({ _id: tokenObj.orgAdminId });
          const orgDetails = await Organization.findOne({_id:adminData.orgId})
          const mailTo = [adminData.email];
          const subject = "Now you are ready to access your DITAxPresso!";
          const mailBody = `<div>
                                <p style="margin:8px 0px">We’re excited to have you as part of the DITAxPresso family!</p>
                                <p style="margin:8px 0px">Now add your team and assign them roles to manage the DITA projects using DITAxPresso.</p>
                                <p style="margin:8px 0px">Visit this 
                                    <a style="background-color:#4374E0;color:white;display:inline-flex;padding:0px 3px;letter-spacing:0.5px" href="${orgDetails.adminHostURL}">link</a> 
                                    to access your DITAxPresso to add your team.
                                </p>
                                <p style="margin:24px 0px 6px 0px">Sincerely,</p>
                                <b style="margin:6px 0px">DITAxPresso Team</b>
                            <div>`;
          await sendMail(mailTo, subject, mailBody);
          await Admin.findOneAndUpdate(
            { _id: tokenObj.orgAdminId },
            { rawpassword: null, isEmailVerified: true, isActive: true }
          );
        } else {
          console.log("Token Expired");
        }
      });
    }
  } catch (err) {
    return err;
  }
}
// organization admin change password
async function changePassword(reqObj) {
  const user = await Admin.findOne({ _id: reqObj.userId });
  if (user && bcrypt.compareSync(reqObj.currentPassword, user.hash)) {
    await Admin.findOneAndUpdate(
      { email: user.email },
      { hash: bcrypt.hashSync(reqObj.newPassword, 10) }
    );
    await Admin.findOneAndUpdate(
      { email: user.email },
      { isChangePassword: true }
    );
    const mailTo = [user.email];
    const subject = "Change Password";
    const mailBody = `<div>
                            <p>Hello ${user.name}</p> 
                            <br>
                            <br>
                            When submit the change passwords system will send email to client admin user just formal email that 
                            your password has been changed on ditaxpresso if you have not done please call to ditaxpresso support -  support@ditaxpresso.com.
                        <div>`;
    await sendMail(mailTo, subject, mailBody);
    // return ressendmail
    return await Admin.findOne({ _id: reqObj.userId });
  }
}
// organization admin forgot Password
async function forgotPassword(reqObj) {
  try {
    let user = await Admin.findOne({ email: reqObj.email });
    const orgDetails = await Organization.findOne({_id:user.orgId})
    if (user && user.isActive === true) {
      const secret =
        "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
      const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "5m" });
      let dataObj = {
        email: user.email,
        token: token,
        orgAdminId: user.id,
        purpose: "forgotpassword token",
      };
      const emailVerifiationToken = new EmailVerifiationToken(dataObj);
      await emailVerifiationToken.save();
      try {
        const mailTo = [user.email];
        const subject = "Please reset your password";
        const mailBody = `<div> 
                                    <h3>Reset your DITAxPresso password</h3> 
                                    <div style="border-radius: 5px; border: 1px solid #e1e4e8; padding: 10px; padding-top: 0px;">
                                    <br /> 
                                    <h4 style="text-align: center;">DITAxPresso password reset</h4> 
                                    <p>We heard that you lost your DITAxPresso password. Sorry about that!</p> 
                                    <p>But don&rsquo;t worry! You can use the following link to reset your password:</p> 
                                    To reset your password 
                                    <a href="${orgDetails.adminHostURL}reset-password/${token}">Click Here</a>.
                                    <br /><br />If you don&rsquo;t use this link within 5 min, it will expire. </br> 
                                    <p>Thanks,<br /> The DITAxPresso Team</p> 
                                    <div>&nbsp;</div> </div> 
                                </div>`;
        let ressendmail = await sendMail(mailTo, subject, mailBody);
        if (ressendmail) {
          return "success";
        } else {
          return "error";
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    return err;
  }
}
// organization admin forgotpassword token verification
async function forgotPasswordTokenVerify(token) {
  try {
    let tokenObj = await EmailVerifiationToken.findOne({ token });
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    let tokenflg;
    if (tokenObj) {
      jwt.verify(token, secret, async function (err, decoded) {
        if (decoded) {
          tokenflg = "Token Valid";
        } else {
          tokenflg = "Token Expired";
        }
      });
      return tokenflg;
    }
  } catch (err) {
    return err;
  }
}
// organization admin reset password
async function resetpassword(reqObj) {
  try {
    let tokenObj = await EmailVerifiationToken.findOne({ token: reqObj.token });
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    let tokenflg;
    if (tokenObj) {
      jwt.verify(tokenObj.token, secret, async function (err, decoded) {
        if (decoded) {
          const user = await Admin.findOne({ _id: tokenObj.orgAdminId });
          if (user && bcrypt.compareSync(reqObj.newPassword, user.hash)) {
            await Admin.findOneAndUpdate(
              { email: user.email },
              { hash: bcrypt.hashSync(reqObj.newPassword, 10) }
            );
            const mailTo = [user.email];
            const subject = "Your password was reset";
            const mailBody = `<div>
                                            <p>Hello ${user.name}</p> 
                                            <br>When submit request for the reset password system will send email to client admin user just formal email that your 
                                            password has been reset on ditaxpresso if you have not done please contact to ditaxpresso support using this email - support@ditaxpresso.com.
                                        </div>`;
            await sendMail(mailTo, subject, mailBody);
            return await Admin.findOne({ _id: tokenObj.orgAdminId });
            // return ressendmail
          }
          tokenflg = "Token Valid";
        } else {
          tokenflg = "Token Expired";
        }
      });
      return tokenflg;
    }
  } catch (err) {
    return err;
  }
}
// Change Password By Admin Id
async function changePasswordByAdminId(orgAdminId, password) {
  let adminData = await Admin.findOne({ _id: orgAdminId });
  return await Admin.findOneAndUpdate(
    { _id: orgAdminId },
    { hash: bcrypt.hashSync(password, 10) }
  );
}
// Active inactive admin by Id
async function ActiveInactiveAdminProfile(orgAdminId, isActive) {
  await Admin.findOneAndUpdate({ _id: orgAdminId }, { isActive: isActive });
  return await Admin.findOne({ _id: orgAdminId });
}
// organization admin reset forgot password (author:Jyoti kamal singh)
async function resetForgotPassword(userDetails) {
  try {
    const tokenObj = await EmailVerifiationToken.findOne({
      token: userDetails.token,
    });
    if (!tokenObj) {
      throw "Invalid or Expired token";
    }
    const tokenPurpose = tokenObj.purpose;
    let isTokenValid;
    const secret =
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT IS METAPERCET SECRET";
    jwt.verify(userDetails.token, secret, async function (err, decoded) {
      if (decoded) {
        isTokenValid = true;
      } else {
        isTokenValid = false;
      }
    });
    /* if tokenObject is present and token is valid and purpose is forgot password request */
    if (tokenObj && isTokenValid && tokenPurpose === "forgotpassword token") {
      /* removing token from database for no further user */
      await EmailVerifiationToken.deleteOne({ token: userDetails.token });
      const result = await Admin.findOneAndUpdate(
        { _id: tokenObj.orgAdminId },
        { hash: bcrypt.hashSync(userDetails.newPassword, 10) }
      );
      const mailTo = [tokenObj.email];
      const subject = "Your password was reset";
      const mailBody = `<div>
                            <p>Dear user,</p> 
                            <br>When submit request for the reset password system will send email to client admin user just formal email that your 
                            password has been reset on ditaxpresso if you have not done please contact to ditaxpresso support using this email - support@ditaxpresso.com.
                        </div>`;
      await sendMail(mailTo, subject, mailBody);
      return result;
    }
    throw "Invalid or Expired token";
  } catch (error) {
    throw error;
  }
}
