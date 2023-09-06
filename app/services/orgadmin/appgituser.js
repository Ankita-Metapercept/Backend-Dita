const db = require('../../config/db')
const _ = require('lodash')
const nodemailer = require('nodemailer');
const User = db.projectUser;

module.exports = {
    getUser,
    getUserById,
    addUser,
    updateUser,
    newUserNotification,
    sendMailToUser
}

async function getUser(projectID) {
  try{
    return await User.find({ projectId: projectID })
  }
  catch(err) {
    return err
  }
}

async function getUserById(projectID, userID) {
  try{
    let userdata = await User.find({ "projectId": projectID })
    return _.filter(userdata[0].appGitUser, (e)=> { return e.gitUserID == userID})
  }
  catch(err) {
    return err
  }
}

async function addUser(userParam) {
  const user = new User(userParam)
  // save user
  let userdata = {}
  await user.save()
}

async function updateUser(userParam) {
  let updatedres = {}
  await User.updateOne(
      { projectId: userParam.projectId },
      { $addToSet: { appGitUser: [userParam.appGitUser] } },
    ).then((newres)=> {
      updatedres = newres
    }).catch((err)=> {
      updatedres = err
    })
    return updatedres
}

async function newUserNotification(repoUser, repoName, gitToken, projectId) {
  try {
    let result = await axios({
        method: 'get',
        url: `https://api.github.com/repos/${repoUser}/${repoName}/collaborators`,
        headers: {
            Authorization: 'token ' + gitToken
        }
    })
    let comdata = []
    // result.data.forEach(async(element) => {
    //     let fildata = await filterdata(element.id, projectId)
    //     if(fildata){
    //       console.log("true")
    //     }else{
    //       comdata.push(element)
    //     }
    // });
    // return comdata
    // ndata = _.filter(result.data, async(e)=> {
    //   let fildata = await filterdata(e.id, projectId)
    //     if(fildata){
    //       return {}
    //     }else{
    //       console.log(e.id)
    //       return e.id
    //     }
    // })
    // return ndata
  }
  catch(err) {
      console.log(err)
      res.send(err)
  }
  
}

async function filterdata(userId, projectId){
  let userdata = await User.find({ projectId: '12342' })
  var userCount = (_.filter(userdata[0].appGitUser, (e)=> { return e.gitUserID == userId }))
  if(userCount.length != 0){
    return true
  }else {
    return false
  }
}

async function sendMailToUser(to_email, subject, email_body ) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lolstudent002@gmail.com',
      pass: 'lizgqntmkddjdnoe'
    }
  });
  
  let mailOptions = {
    from: 'lolstudent002@gmail.com',
    to: to_email,
    subject: subject,
    text: email_body
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return error
    } else {
      return info.response
    }
  });
}