// helpers/emailHelper.js
import nodemailer from 'nodemailer';

export async function sendEmail(toEmail, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail username
      pass: process.env.GMAIL_PASS, // Your Gmail password
    },
  });

  const mailOptions = {
    to: toEmail,
    from: process.env.GMAIL_USER, // Your Gmail username
    subject: subject,
    html: text,
  };

  return transporter.sendMail(mailOptions);
}
