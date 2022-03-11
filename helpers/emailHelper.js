
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bilgebatman19@gmail.com',
      pass: 'Superman!35'
    }
  });
  

  function SendEMail(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  module.exports = {
      SendEMail
  }