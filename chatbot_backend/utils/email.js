
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    debug: true 
  });


  transporter.verify(function(error, success) {
    if (error) {
      console.log('Transporter verification error:', error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  return transporter;
};

const sendVerificationEmail = async (email, code) => {
  
  console.log('Email configuration:', {
    email: process.env.EMAIL,
    appPasswordLength: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0
  });

  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Verification Service" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Email Verification',
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
    return true;
  } catch (error) {
    console.error('Detailed email error:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw new Error('Failed to send email: ' + error.message);
  }
};

module.exports = { sendVerificationEmail };