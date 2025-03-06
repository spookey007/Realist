import { pool } from '../db/db.js';
import { sendEmail } from '../helpers/emailHelper.js';
import { v4 as uuidv4 } from 'uuid';

export const createInvite = async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the email exists in the "User" table (already registered)
    const userCheckQuery = `SELECT * FROM "Users" WHERE email = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "User already joined." });
    }

    // Check if an invite already exists for this email
    const inviteCheckQuery = `SELECT * FROM "Invites" WHERE email = $1;`;
    const inviteCheckResult = await pool.query(inviteCheckQuery, [email]);

    if (inviteCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "An invite for this email already exists." });
    }

    // Generate an invite link
    const inviteLink = `https://realist.galico.io/invite/${uuidv4()}`;

    const query = `
      INSERT INTO "Invites" (email, invite_link, role, "created_at", "updated_at", "expires_at")
      VALUES ($1, $2, $3, NOW(), NOW(), NOW() + INTERVAL '3 days') RETURNING *;
    `;
    const values = [email, inviteLink, role];

    const result = await pool.query(query, values);
    const invite = result.rows[0];

    // Send invite email
    const emailSubject = "You're Invited! Complete Your Registration";
    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Welcome!</h2>
          <p>You have been invited. Click the link below to complete your registration:</p>
          <p><a href="${inviteLink}" style="color: blue; text-decoration: underline;">Complete Registration</a></p>
          <p>If you have any questions, please reach out.</p>
          <p>Best regards,<br>Team</p>
        </body>
      </html>
    `;
    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ message: "Invite created and sent successfully.", invite });
  } catch (error) {
    console.error("Error creating invite:", error);
    res.status(500).json({ message: "Failed to create invite." });
  }
};


export const updateInvite = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!Object.keys(updatedData).length) {
    return res.status(400).json({ message: "No data provided for update." });
  }

  try {
    // Check if the invite exists
    const checkQuery = `SELECT * FROM "Invites" WHERE id = $1;`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Invite not found." });
    }

    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "Invites"
      SET ${fields.join(", ")}, "updated_at" = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updatedData)];

    const result = await pool.query(query, values);

    res.status(200).json({ message: "Invite updated successfully.", invite: result.rows[0] });
  } catch (error) {
    console.error("Error updating invite:", error);
    res.status(500).json({ message: "Failed to update invite." });
  }
};


// Resend an invite email
export const resendInvite = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `SELECT * FROM "Invites" WHERE id = $1;`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invite not found." });
    }

    const { email, invite_link } = result.rows[0];

    if(!validate_expiry_date(result.rows[0].expires_at)){
      // create new invite
      const inviteLink = `https://realist.galico.io/invite/${uuidv4()}`;
      const query = `
        UPDATE "Invites" SET invite_link = $1, "updated_at" = NOW(), "expires_at" = NOW() + INTERVAL '3 days' WHERE email = $2 RETURNING *;
      `;
      const values = [inviteLink, email];
      const result = await pool.query(query, values);

      // return res.status(400).json({ message: "Invite expired" });
    }
    const emailSubject = "Reminder: Your Invitation is Waiting!";
    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Greetings,</h2>
          <p>We noticed you haven't completed your registration yet. Click below to accept your invite:</p>
          <p><a href="${invite_link}" style="color: blue; text-decoration: underline;">Complete Registration</a></p>
          <p>Best regards,<br>Team</p>
        </body>
      </html>
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(200).json({ message: "Invite resent successfully." });
  } catch (error) {
    console.error("Error resending invite:", error);
    res.status(500).json({ message: "Failed to resend invite." });
  }
};

// Get all invites
export const getInvites = async (req, res) => {
  try {
    const query = `SELECT inv.*, rol.name as role_name FROM "Invites" as inv LEFT JOIN "Roles" as rol on rol.id = inv.role  ORDER BY "created_at" DESC;`;
    const result = await pool.query(query);

    res.status(200).json({ invites: result.rows });
  } catch (error) {
    console.error("Error fetching invites:", error);
    res.status(500).json({ message: "Failed to retrieve invites." });
  }
};

function validate_expiry_date(date) {
  const expiry_date = new Date(date);
  const current_date = new Date();
  return expiry_date > current_date;
}