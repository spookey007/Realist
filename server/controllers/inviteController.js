import { pool } from '../db/db.js';
import { sendEmail } from '../helpers/emailHelper.js';
import { v4 as uuidv4 } from 'uuid';

export const createInvite = async (req, res) => {
  const { email, role, created_by } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // ✅ Check if the user already exists
    const userCheckQuery = `SELECT * FROM "Users" WHERE email = $1;`;
    const userCheckResult = await pool.query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "User already joined." });
    }

    // ✅ Check if invite already exists for this email
    const inviteCheckQuery = `SELECT * FROM "Invites" WHERE email = $1;`;
    const inviteCheckResult = await pool.query(inviteCheckQuery, [email]);

    if (inviteCheckResult.rows.length > 0) {
      return res.status(409).json({ message: "An invite for this email already exists." });
    }

    // ✅ Insert invite (uuid generated automatically by DB)
    const insertInviteQuery = `
      INSERT INTO "Invites" (email, role, "created_by", "created_at", "updated_at", "expires_at")
      VALUES ($1, $2, $3, NOW(), NOW(), NOW() + INTERVAL '3 days')
      RETURNING uuid;
    `;
    const insertValues = [email, role, created_by];
    const result = await pool.query(insertInviteQuery, insertValues);
    const { uuid } = result.rows[0]; // ✅ Extract generated UUID

    // ✅ Build invite link dynamically
    const inviteLink = `https://realistapp.com/invite/${uuid}`;

    // ✅ Optional: Store invite link back in table for reference
    // const updateInviteLinkQuery = `UPDATE "Invites" SET invite_link = $1 WHERE uuid = $2;`;
    // await pool.query(updateInviteLinkQuery, [inviteLink, uuid]);

    // ✅ Send invite email
    const emailSubject = "You're Invited! Complete Your Registration";

    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center">
                <h2 style="color: #333;">Welcome to Realist!</h2>
                <p style="font-size: 16px; color: #555;">
                  You have been invited to join our platform. Please click the button below to complete your registration.
                </p>
                <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
                  Complete Registration
                </a>
                <p style="font-size: 14px; color: #777;">
                  If the button doesn't work, copy and paste the link below into your browser:
                </p>
                <p style="font-size: 14px; color: #007bff;">${inviteLink}</p>
                <p style="margin-top: 30px; color: #555;">Best regards,<br>Realist Team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ message: "Invite created and sent successfully.", invite: { email, role, uuid, inviteLink } });
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
  const { id } = req.params; // This should be the UUID of the invite

  try {
    // ✅ Fetch invite by UUID
    const fetchInviteQuery = `SELECT * FROM "Invites" WHERE id = $1;`;
    const fetchResult = await pool.query(fetchInviteQuery, [id]);

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ message: "Invite not found." });
    }

    let { email, invite_link, expires_at } = fetchResult.rows[0];

    // ✅ If expired, generate new invite link and update DB
    if (!validate_expiry_date(expires_at)) {
      // ✅ Extend expiration by 3 more days without changing UUID or invite_link
      const updateInviteQuery = `
        UPDATE "Invites"
        SET "updated_at" = NOW(), "expires_at" = NOW() + INTERVAL '3 days'
        WHERE id = $1
        RETURNING *;
      `;
      const updateValues = [id]; // Use UUID as identifier
      const updateResult = await pool.query(updateInviteQuery, updateValues);
    
      // Update invite_link in case you want to make sure you have the fresh one (though it's the same)
      invite_link = updateResult.rows[0].invite_link;
    }
    

    // ✅ Send reminder email with invite link
    const emailSubject = "Reminder: Your Invitation is Waiting!";
    const emailText = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center">
                <h2 style="color: #333;">Hello!</h2>
                <p style="font-size: 16px; color: #555;">
                  We noticed you haven't completed your registration yet. Please click the button below to accept your invitation.
                </p>
                <a href="${invite_link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
                  Complete Registration
                </a>
                <p style="font-size: 14px; color: #777;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #007bff;">${invite_link}</p>
                <p style="margin-top: 30px; color: #555;">Best regards,<br>Realist Team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(200).json({ message: "Invite resent successfully.", invite_link });
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
