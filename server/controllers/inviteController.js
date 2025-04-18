import { pool } from '../db/db.js';
import { sendEmail } from '../helpers/emailHelper.js';
import { v4 as uuidv4 } from 'uuid';

export const createInvite = async (req, res) => {
  const { email, role, created_by } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = `SELECT * FROM "Users" WHERE email = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "User already joined." });
    }

    // Check if invite already exists for this email
    const inviteCheckQuery = `SELECT * FROM "Invites" WHERE email = $1;`;
    const inviteCheckResult = await pool.query(inviteCheckQuery, [email]);

    if (inviteCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "An invite for this email already exists." });
    }

    // Insert invite (uuid generated automatically by DB)
    const insertInviteQuery = `
      INSERT INTO "Invites" (email, role, "created_by", "created_at", "updated_at", "expires_at")
      VALUES ($1, $2, $3, NOW(), NOW(), NOW() + INTERVAL '3 days')
      RETURNING uuid;
    `;
    const insertValues = [email, role, created_by];
    const result = await pool.query(insertInviteQuery, insertValues);
    const { uuid } = result.rows[0];

    // Send invite email
    const emailSubject = "Your Realist Invitation Code";

    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center">
                <h2 style="color: #333;">Welcome to Realist!</h2>
                <p style="font-size: 16px; color: #555;">
                  You have been invited to join our platform. Here's your invitation code:
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0;">${uuid}</p>
                </div>
                <p style="font-size: 16px; color: #555;">
                  To complete your registration:
                </p>
                <ol style="text-align: left; color: #555;">
                  <li>Visit <a href="https://realistapp.com" style="color: #007bff;">realistapp.com</a></li>
                  <li>Click on get started and "Sign up with Google"</li>
                  <li>Enter your invitation code when prompted</li>
                </ol>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                  This invitation code will expire in 3 days.
                </p>
                <p style="margin-top: 30px; color: #555;">Best regards,<br>Realist Team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ 
      message: "Invite created and sent successfully.", 
      invite: { 
        email, 
        role, 
        inviteCode: uuid,
        instructions: "Please sign in with Google and use the invite code during registration."
      } 
    });
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
    // Fetch invite by UUID
    const fetchInviteQuery = `SELECT * FROM "Invites" WHERE id = $1;`;
    const fetchResult = await pool.query(fetchInviteQuery, [id]);

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ message: "Invite not found." });
    }

    const invite = fetchResult.rows[0];

    // If expired, extend expiration by 3 more days
    if (!validate_expiry_date(invite.expires_at)) {
      const updateInviteQuery = `
        UPDATE "Invites"
        SET "updated_at" = NOW(), "expires_at" = NOW() + INTERVAL '3 days'
        WHERE id = $1
        RETURNING *;
      `;
      const updateResult = await pool.query(updateInviteQuery, [id]);
      invite.expires_at = updateResult.rows[0].expires_at;
    }

    // Send reminder email with invite code
    const emailSubject = "Your Realist Invitation Code (Reminder)";

    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center">
                <h2 style="color: #333;">Welcome to Realist!</h2>
                <p style="font-size: 16px; color: #555;">
                  Here's your invitation code again:
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0;">${invite.uuid}</p>
                </div>
                <p style="font-size: 16px; color: #555;">
                  To complete your registration:
                </p>
                <ol style="text-align: left; color: #555;">
                  <li>Visit <a href="https://realistapp.com" style="color: #007bff;">realistapp.com</a></li>
                  <li>Click on get started and "Sign up with Google"</li>
                  <li>Enter your invitation code when prompted</li>
                </ol>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                  This invitation code will expire in 3 days.
                </p>
                <p style="margin-top: 30px; color: #555;">Best regards,<br>Realist Team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await sendEmail(invite.email, emailSubject, emailText);

    res.status(200).json({ 
      message: "Invite resent successfully.", 
      invite: { 
        email: invite.email, 
        role: invite.role, 
        inviteCode: invite.uuid,
        instructions: "Please sign in with Google and use the invite code during registration."
      } 
    });
  } catch (error) {
    console.error("Error resending invite:", error);
    res.status(500).json({ message: "Failed to resend invite." });
  }
};
// Get all invites
export const getInvites = async (req, res) => {
  const { user_id } = req.query; // Get user_id from query if present

  try {
    // Base query
    let query = `
      SELECT inv.*, rol.name as role_name 
      FROM "Invites" as inv 
      LEFT JOIN "Roles" as rol ON rol.id = inv.role
    `;

    // Conditionally add WHERE clause if user_id is provided
    const values = [];
    if (user_id) {
      query += ` WHERE inv.created_by = $1`;
      values.push(user_id);
    }

    // Order by created_at descending
    query += ` ORDER BY inv."created_at" DESC`;

    // Execute query
    const result = await pool.query(query, values);

    // Return result
    res.status(200).json({ invites: result.rows });
  } catch (error) {
    console.error("Error fetching invites:", error);
    res.status(500).json({ message: "Failed to retrieve invites." });
  }
};


export const getInvitesById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM "Invites" WHERE uuid = $1 and status=1;`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invitation not found.' });
    }

    const invite = result.rows[0];

    // Check expiration
    if (!validate_expiry_date(invite.expires_at)) {
      return res.status(410).json({ message: 'Invitation has expired.' }); // 410 Gone status for expired resource
    }
    res.status(200).json({ invite });
  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Expiry date validation function
function validate_expiry_date(date) {
  const expiry_date = new Date(date);
  const current_date = new Date();
  return expiry_date > current_date; // True if not expired
}
