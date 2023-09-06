const express = require('express')
const router = express.Router()
var nodemailer = require('nodemailer');
const jwt = require('../config/orgadmin/jwt');

const app = express()
app.use(jwt)

router.post('/sendmail', function(req, res) {
  console.log("Hello")
    var to_email = req.body.to_email
    var subject = req.body.subject
    var email_body = req.body.email_body
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lolstudent002@gmail.com",
        pass: "lizgqntmkddjdnoe",
      },
    });
      
      var mailOptions = {
        from: "lolstudent002@gmail.com",
        to: to_email,
        subject: subject,
        html: email_body,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send(error);
        } else {
          res.send(info.response);
        }
      });
})

module.exports = router