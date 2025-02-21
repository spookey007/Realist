// controllers/appointmentController.js
import { sendEmail } from '../helpers/emailHelper.js';
import { verifyRecaptcha } from '../helpers/recaptchaHelper.js';
import { pool } from '../db/db.js';

export const SaveAppointment = async (req, res) => {
  const { name, email, phone, message, dateTime, captchaValue, latitude, longitude, address } = req.body;
  const rescheduled = 0;
  
  // Log the request body
  console.log('Request Body:', req.body);

  // Verify reCAPTCHA
  const isRecaptchaValid = await verifyRecaptcha(captchaValue);
  if (!isRecaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed' });
  }

  // Prepare the email for the appointment
  const emailSubject = 'New Appointment';
  const emailText = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <p><strong>Date & Time:</strong> ${dateTime}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Latitude:</strong> ${latitude}</p>
      <p><strong>Longitude:</strong> ${longitude}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #888; font-size: 12px;">This message was sent from your website.</p>
    </body>
  </html>
  `;

  try {
    // Log the values before the query
    const values = [name, email, phone, message, dateTime, latitude, longitude, address, rescheduled];
    console.log('Inserting values:', values);
  
    // Save the appointment details to PostgreSQL
    const query = `
      INSERT INTO "appointments" (name, email, phone, message, "dateTime", latitude, longitude, address, rescheduled)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    
    const result = await pool.query(query, values);
  
    // Send the confirmation email
    await sendEmail(email, emailSubject, emailText);
  
    res.status(200).json({ message: 'Appointment Booked', appointment: result.rows[0] });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Failed to create Appointment' });
  }
};



export const GetAppointmentAdmin = async (req, res) => {
  try {
    console.log("received at controller");
    // Query to get all appointments from the database
    const query = 'SELECT * FROM "appointments" ORDER BY "dateTime" DESC;';
    const result = await pool.query(query);

    // Send the fetched appointments as a JSON response
    res.status(200).json({ appointments: result.rows });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to retrieve appointments' });
  }
};

export const UpdateAppointmentAdmin = async (req, res) => {
  console.log('Reached update endpoint');
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Determine action based on payload
    let action;
    let newDateTime;

    if (updatedData.status === 1 && updatedData.rescheduled === 1 && updatedData.rescheduled_dateTime) {
      action = 'reschedule';
      newDateTime = updatedData.rescheduled_dateTime;
    } else if (updatedData.status === 2) {
      action = 'decline';
    } else if (updatedData.status === 1 && !updatedData.rescheduled) {
      action = 'confirm';
    }

    // Update query based on fields in updatedData
    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "appointments"
      SET ${fields.join(', ')}
      WHERE "id" = $1
      RETURNING *;
    `;

    const values = [id, ...Object.values(updatedData)];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const updatedAppointment = result.rows[0];
    const { email, name, dateTime } = updatedAppointment;
    
    // Define email subjects and contents based on action
    let emailSubject;
    let emailText;

    switch (action) {
      case 'confirm':
        emailSubject = 'Your Appointment is Confirmed';
        emailText = `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Appointment Confirmed</h2>
              <p>Dear ${name},</p>
              <p>Your appointment on ${dateTime} has been confirmed.</p>
              <p>Thank you for choosing ${process.env.GMAIL_USER}</p>
              <p>Best regards,<br>Appointment Team</p>
            </body>
          </html>
        `;
        break;

      case 'decline':
        emailSubject = 'Your Appointment has been Declined';
        emailText = `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Appointment Declined</h2>
              <p>Dear ${name},</p>
              <p>We regret to inform you that your appointment on ${dateTime} has been declined.</p>
              <p>Please contact us for further assistance.</p>
              <p>Best regards,<br>Appointment Team</p>
            </body>
          </html>
        `;
        break;

      case 'reschedule':
        emailSubject = 'Your Appointment has been Rescheduled';
        emailText = `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Appointment Rescheduled</h2>
              <p>Dear ${name},</p>
              <p>Your appointment has been rescheduled to ${newDateTime}.</p>
              <p>If you have any questions, please reach out to us.</p>
              <p>Best regards,<br>Appointment Team</p>
            </body>
          </html>
        `;
        break;

      default:
        return res.status(400).json({ message: 'Invalid action specified' });
    }

    // Send email to customer
    await sendEmail(email, emailSubject, emailText);

    // Send email to admin
    const adminEmail = process.env.GMAIL_USER; // Replace with actual admin email
    await sendEmail(adminEmail, `Admin Notification: ${emailSubject}`, emailText);

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};