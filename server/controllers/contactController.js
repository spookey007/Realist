// controllers/contactController.js
import { sendEmail } from '../helpers/emailHelper.js';
import { verifyRecaptcha } from '../helpers/recaptchaHelper.js';
import { pool } from '../db/db.js';

export const contactController = async (req, res) => {
  const { name, email, phone, message, captchaValue } = req.body;
  
  // Verify reCAPTCHA
  const isRecaptchaValid = await verifyRecaptcha(captchaValue);
  if (!isRecaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed' });
  }

  // Prepare the email
  const emailSubject = 'Contact Us Submission';
  const emailText = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #888; font-size: 12px;">This message was sent from your website.</p>
    </body>
  </html>
  `;

  try {
    // Save the contact details to PostgreSQL
    const query = `
      INSERT INTO contacts (name, email, phone, message)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [name, email, phone, message];

    const result = await pool.query(query, values);

    // Send the confirmation email
    await sendEmail(email, emailSubject, emailText);

    res.status(200).json({ message: 'Contact form message sent successfully', contact: result.rows[0] });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ message: 'Failed to send contact form message' });
  }
};
