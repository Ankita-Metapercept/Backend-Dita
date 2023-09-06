const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });

exports.sendMail = async function (mailTo, subject, mailBody) {
  try {
    const {
      NoDEMAILER_MAIL_ID: sender,
      NODEMAILER_MAIL_ID_PASSWORD: password,
    } = process.env;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender || "lolstudent002@gmail.com",
        pass: password || "lizgqntmkddjdnoe",
      },
    });
    let mailOptions = {
      from: sender || "lolstudent002@gmail.com",
      to: mailTo,
      subject,
      html: mailBody,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error)
    throw error;
  }
};

