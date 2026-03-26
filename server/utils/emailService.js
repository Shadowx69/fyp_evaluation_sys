const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  // 1. Create Transporter (For Gmail, you need App Password. For testing, use Ethereal)
  // For this assignment, we will log to console to avoid credential issues.
  console.log("---------------------------------------------------");
  console.log(`[EMAIL SIMULATION] To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  console.log("---------------------------------------------------");
  
  /* REAL IMPLEMENTATION:
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: '"AFMS System" <no-reply@afms.edu>', to, subject, text });
  */
};

module.exports = sendEmail;