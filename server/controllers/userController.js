import { pool } from '../db/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from '../helpers/emailHelper.js';
import { verifyToken } from "@clerk/backend";

const JWT_SECRET = process.env.JWT_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

function generateNameFromEmail(email) {
  if (!email.includes('@')) return 'Invalid Email';

  const username = email.split('@')[0]; // Get the part before '@'
  const words = username.replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/); // Remove special chars & split into words

  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Create a new user
export const createUserA = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (await emailExists(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  let name = generateNameFromEmail(email);
  const hashedPassword = await hashPassword(password);

  try {
    const query = `
      INSERT INTO "Users" (name, email, encrypted_password, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email;
    `;
    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);

    const user = result.rows[0];

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const createUserB = async (req, res) => {
  const { name, email, password, status, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (await emailExists(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const hashedPassword = await hashPassword(password);

  try {
    const query = `
      INSERT INTO "Users" (name, email, encrypted_password,role,status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, name, email;
    `;
    const values = [name, email, hashedPassword, role, status];
    const result = await pool.query(query, values);

    const user = result.rows[0];

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const registerContractor = async (req, res) => {
  const {
    fullName,
    companyName,
    email,
    phone,
    website,
    address,
    city,
    state,
    zipCode,
    serviceCategory,
    yearsOfExperience,
    coverageArea,
    licenseNumber,
    insurancePolicy,
    references,
    description,
    files,
    invite_id
  } = req.body;
  const role = 3;
  const password = "Test1214@"
  // const password = crypto.randomBytes(8).toString('hex'); // 16 hex chars = 8 bytes
  const status = 0;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  if (await emailExists(email)) {
    console.log(emailExists(email))
    return res.status(400).json({ message: 'Email already exists' });
  }
  try {
    const hashedPassword = await hashPassword(password);

    const query = `
    INSERT INTO "Users" 
    (name, company_name, email, encrypted_password, role, status, phone, website, address, city, state, postal_code,
     service_category, years_of_experience, coverage_area, license_number, insurance_policy, "references", description, files, 
     "createdAt", "updatedAt")
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
    RETURNING id, name, email;
  `;
  

    const values = [
      fullName,          // name
      companyName,       // company_name
      email,             // email
      hashedPassword,    // encrypted_password
      role,              // role
      status,            // status
      phone,             // phone
      website,           // website
      address,           // address
      city,              // city
      state,             // state
      zipCode,           // postal_code
      serviceCategory,   // service_category
      yearsOfExperience, // years_of_experience
      JSON.stringify(coverageArea), // coverage_area as JSON
      licenseNumber,    // license_number
      insurancePolicy,  // insurance_policy
      JSON.stringify(references), // references as JSON
      description,      // description
      JSON.stringify(files) // files as JSON
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];
    if (invite_id) {
      await pool.query(
        `UPDATE "Invites" SET status = 0, "updated_at" = NOW() WHERE uuid = $1;`,
        [invite_id]
      );
    }
    // Example: Enhanced email template for inviting users

    const emailSubject = "We've Received Your Contractor Registration Request!";

    const emailText = `
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <img src="https://realistapp.com/assets/slate-R-logo-f5_dY64Q.svg" alt="Realist" width="180" style="display: block;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h2 style="color: #333333; margin-bottom: 10px;">Thank You for Registering!</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      Hello,
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      We have received your contractor registration request on <strong>Realist</strong>. Our team is currently reviewing your application to ensure everything is in order.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      You will receive a confirmation email once your account has been approved and activated.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      In the meantime, if you have any questions, feel free to reach out to us.
                    </p>
                    <a href="https://realistapp.com/" target="_blank" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                      Contact Support
                    </a>
                    <p style="color: #333333; font-size: 14px; margin-top: 30px;">
                      Best regards,<br>The Realist Team
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #f0f0f0; border-radius: 0 0 8px 8px;">
                    <p style="color: #888888; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Realist by Galico. All rights reserved.
                    </p>
                    <p style="color: #888888; font-size: 12px; margin: 5px 0 0;">
                      <a href="https://realistapp.com" style="color: #007bff; text-decoration: none;">Visit our website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;
    
    await sendEmail(email, emailSubject, emailText);
    res.status(201).json({ message: 'Contractor registered successfully', user });

  } catch (error) {
    console.error('Error registering contractor:', error);
    res.status(500).json({ message: 'Failed to register contractor', error: error.message });
  }
};


export const updateContractor = async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  const {
    fullName,
    companyName,
    email,
    phone,
    website,
    address,
    city,
    state,
    zipCode,
    serviceCategory,
    yearsOfExperience,
    coverageArea,
    licenseNumber,
    insurancePolicy,
    references,
    description,
    files,
    invite_id // Optional invite_id if updating invite status is required
  } = req.body;

  try {
    // Check if contractor exists in the database
    const userCheckQuery = `SELECT * FROM "Users" WHERE id = $1`; // Checking if the user exists
    const userResult = await pool.query(userCheckQuery, [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is registered as a guest (role = 0), update role to contractor (role = 3)
    let updatedRole = user.role;
    if (updatedRole === 0) {  // If role is guest (0)
      updatedRole = 3; // Change to contractor role
    }

    // Prepare the query to update contractor details
    const updateQuery = `
      UPDATE "Users" 
      SET 
        name = $1, 
        company_name = $2, 
        email = $3,
        role = $4, -- Assign the updated role
        status = 1, -- Ensuring status is active
        phone = $5, 
        website = $6, 
        address = $7, 
        city = $8, 
        state = $9, 
        postal_code = $10, 
        service_category = $11, 
        years_of_experience = $12, 
        coverage_area = $13, 
        license_number = $14, 
        insurance_policy = $15, 
        "references" = $16, 
        description = $17, 
        files = $18, 
        "updatedAt" = NOW()
      WHERE id = $19
      RETURNING id, name, email, role;
    `;

    const values = [
      fullName,              // name
      companyName,           // company_name
      email,                 // email
      updatedRole,           // updated role (contractor if role was 0)
      phone,                 // phone
      website,               // website
      address,               // address
      city,                  // city
      state,                 // state
      zipCode,               // postal_code
      serviceCategory,       // service_category
      yearsOfExperience,     // years_of_experience
      JSON.stringify(coverageArea), // coverage_area as JSON
      licenseNumber,         // license_number
      insurancePolicy,       // insurance_policy
      JSON.stringify(references),  // references as JSON
      description,           // description
      JSON.stringify(files), // files as JSON
      id                     // user id to be updated
    ];

    const result = await pool.query(updateQuery, values);
    const updatedUser = result.rows[0];

    // Optionally, update the invite status if invite_id is provided
    if (invite_id) {
      await pool.query(
        `UPDATE "Invites" SET status = 0, "updated_at" = NOW() WHERE uuid = $1;`,
        [invite_id]
      );
    }

    // Fetch the menu based on the updated user's role
    const menu = await getUserMenu(updatedUser.role);

    // Prepare the response with updated user and menu
    const responseJson = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      menu: menu // Attach the menu to the response
    };

    // Generate a token for the updated user
    const token = generateToken(updatedUser, "1h");

    // Send the response with the updated user and menu
    res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: responseJson,
    });

  } catch (error) {
    console.error('Error updating contractor:', error);
    res.status(500).json({ message: 'Failed to update contractor', error: error.message });
  }
};



export const registerRea = async (req, res) => {
  const {
    fullName,
    companyName,
    email,
    phone,
    website,
    address,
    city,
    state,
    zipCode,
    serviceCategory,
    yearsOfExperience,
    coverageArea,
    licenseNumber,
    issuingAuthority,
    specialties,
    affiliations,
    insurancePolicy,
    references,
    description,
    files
  } = req.body;

  const role = 2;
  const password = "Test1214@"
  // const password = crypto.randomBytes(8).toString('hex'); // 16 hex chars = 8 bytes
  const status = 0;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (await emailExists(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  try {
    const hashedPassword = await hashPassword(password);

    const query = `
    INSERT INTO "Users" 
    (name, company_name, email, encrypted_password, role, status, phone, website, address, city, state, postal_code,
     service_category, years_of_experience, coverage_area, license_number, "issuingAuthority", specialties, affiliations, 
     insurance_policy, "references", description, files, "createdAt", "updatedAt")
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW())
    RETURNING id, name, email;
  `;

    const values = [
      fullName,              // name
      companyName,           // company_name
      email,                 // email
      hashedPassword,        // encrypted_password
      role,                  // role
      status,                // status
      phone,                 // phone
      website,               // website
      address,               // address
      city,                  // city
      state,                 // state
      zipCode,               // postal_code
      serviceCategory,       // service_category
      yearsOfExperience,     // years_of_experience
      JSON.stringify(coverageArea), // coverage_area as JSON
      licenseNumber,         // license_number
      issuingAuthority,      // issuing_authority
      JSON.stringify(specialties),  // specialties as JSON
      JSON.stringify(affiliations), // affiliations as JSON
      insurancePolicy,       // insurance_policy
      JSON.stringify(references),  // references as JSON
      description,           // description
      JSON.stringify(files)  // files as JSON
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    // ✅ Professional email template
    const emailSubject = "We've Received Your Registration Request!";

    const emailText = `
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <img src="https://realistapp.com/assets/slate-R-logo-f5_dY64Q.svg" alt="Realist" width="180" style="display: block;">
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h2 style="color: #333333; margin-bottom: 10px;">Thank You for Registering!</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      Hello ${fullName},
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      We have received your contractor registration request on <strong>Realist</strong>. Our team is reviewing your application to ensure everything is in order.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      You will receive a confirmation email once your account is approved and activated.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                      If you have any questions, feel free to reach out to us.
                    </p>
                    <a href="https://realistapp.com/" target="_blank" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                      Contact Support
                    </a>
                    <p style="color: #333333; font-size: 14px; margin-top: 30px;">
                      Best regards,<br>The Realist Team
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #f0f0f0; border-radius: 0 0 8px 8px;">
                    <p style="color: #888888; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Realist by Galico. All rights reserved.
                    </p>
                    <p style="color: #888888; font-size: 12px; margin: 5px 0 0;">
                      <a href="https://realistapp.com" style="color: #007bff; text-decoration: none;">Visit our website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ message: 'Contractor registered successfully', user });

  } catch (error) {
    console.error('Error registering contractor:', error);
    res.status(500).json({ message: 'Failed to register contractor', error: error.message });
  }
};

export const updateRea = async (req, res) => {
  const { id } = req.params; // Get user ID from the URL parameter
  console.log(id)
  const {
    fullName,
    companyName,
    email,
    phone,
    website,
    address,
    city,
    state,
    zipCode,
    serviceCategory,
    yearsOfExperience,
    coverageArea,
    licenseNumber,
    issuingAuthority,
    specialties,
    affiliations,
    insurancePolicy,
    references,
    description,
    files
  } = req.body;

  try {
    // Update the user's details in the database
    const updateQuery = `
      UPDATE "Users" 
      SET 
        name = $1, 
        company_name = $2, 
        email = $3, 
        status = 1, 
        role = 2, 
        phone = $4, 
        website = $5, 
        address = $6, 
        city = $7, 
        state = $8, 
        postal_code = $9, 
        service_category = $10, 
        years_of_experience = $11, 
        coverage_area = $12, 
        license_number = $13, 
        "issuingAuthority" = $14, 
        specialties = $15, 
        affiliations = $16, 
        insurance_policy = $17, 
        "references" = $18, 
        description = $19, 
        files = $20, 
        "updatedAt" = NOW()
      WHERE id = $21
      RETURNING id, name, email, role;
    `;

    const values = [
      fullName,              // name
      companyName,           // company_name
      email,                 // email
      phone,                 // phone
      website,               // website
      address,               // address
      city,                  // city
      state,                 // state
      zipCode,               // postal_code
      serviceCategory,       // service_category
      yearsOfExperience,     // years_of_experience
      JSON.stringify(coverageArea), // coverage_area as JSON
      licenseNumber,         // license_number
      issuingAuthority,      // issuing_authority
      JSON.stringify(specialties),  // specialties as JSON
      JSON.stringify(affiliations), // affiliations as JSON
      insurancePolicy,       // insurance_policy
      JSON.stringify(references),  // references as JSON
      description,           // description
      JSON.stringify(files), // files as JSON
      id                     // user id to be updated
    ];

    const result = await pool.query(updateQuery, values);
    const updatedUser = result.rows[0];

    // Fetch the menu based on the user's role
    const menu = await getUserMenu(updatedUser.role);
    // console.log(menu)
    // Send response with the updated user and menu
    const responseJson = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      menu: menu // Attach the menu
    };
    let token = generateToken(updatedUser, "1h");
    // Send the response with the updated user and menu
    res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: responseJson,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};


// Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    // Check if email exists for another user
    if (updatedData.email && (await emailExistsForAnotherUser(updatedData.email, id))) {
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "Users"
      SET ${fields.join(', ')}, "updatedAt" = NOW()
      WHERE "id" = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updatedData)];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT
        "Users"."id",
        "Users"."name",
        "Users"."email",
        "Users"."status",
        "Users"."role",
        "Users"."phone",
        "Users"."address",
        "Users"."city",
        "Users"."state",
        "Users"."country",
        "Users"."postal_code",
        "Users"."lat",
        "Users"."lon",
        "Users"."last_login",
        "Users"."profile_picture_url",
        "Users"."createdAt",
        "Users"."updatedAt",
        "Users"."company_name",
        "Users"."website",
        "Users"."service_category",
        "Users"."years_of_experience",
        "Users"."coverage_area",
        "Users"."license_number",
        "Users"."insurance_policy",
        "Users"."references",
        "Users"."description",
        "Users"."files",
        "Users"."licenseNumber",
        "Users"."issuingAuthority",
        "Users"."specialties",
        "Users"."affiliations",
        "Roles"."name" AS "role_name"
      FROM "Users"
      LEFT JOIN "Roles" ON "Users"."role" = "Roles"."id";
    `;
    
    const result = await pool.query(query);
    res.status(200).json({ users: result.rows });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const query = 'SELECT id, name, email, "createdAt", "updatedAt" FROM "Users" WHERE "id" = $1;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const query = 'DELETE FROM "Users" WHERE "id" = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userQuery = 'SELECT * FROM "Users" WHERE "email" = $1;';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    if (!user.encrypted_password) {
      return res.status(500).json({ message: "User record is missing a password" });
    }

    const isMatch = await bcrypt.compare(password, user.encrypted_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch menu for this user's role
    const menuQuery = `
      SELECT 
        m.*,
        r.privs
      FROM "Menus" m
      INNER JOIN "RoleMenuRights" r ON m.id = r.menu_id
      WHERE m.status = 1 AND r.role_id = $1
      ORDER BY m.position ASC;
    `;
    const menuResult = await pool.query(menuQuery, [user.role]);

    let menu = menuResult.rows;

    // Generate JWT
    let token = generateToken(user, "1h");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        menu: menu || [],
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};

const emailExists = async (email) => {
  try {
    const query = 'SELECT 1 FROM "Users" WHERE "email" = $1 LIMIT 1;';
    const result = await pool.query(query, [email]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const emailExistsForAnotherUser = async (email, userId) => {
  try {
    const query = 'SELECT 1 FROM "Users" WHERE "email" = $1 AND "id" <> $2 LIMIT 1;';
    const result = await pool.query(query, [email, userId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// export const clerkAuth = async (req, res) => {
//   const { email, name } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     // Step 1: Check if user already exists
//     const userQuery = 'SELECT * FROM "Users" WHERE "email" = $1;';
//     const userResult = await pool.query(userQuery, [email]);

//     let user;

//     if (userResult.rowCount > 0) {
//       // Existing user
//       user = userResult.rows[0];
//     } else {
//       // New user - insert into DB
//       const defaultRole = 2; // 🔒 e.g. 1 = admin, 2 = user

//       const insertQuery = `
//         INSERT INTO "Users" ("name", "email", "role")
//         VALUES ($1, $2, $3)
//         RETURNING *;
//       `;
//       const insertResult = await pool.query(insertQuery, [name, email, defaultRole]);
//       user = insertResult.rows[0];
//     }

//     // Step 2: Fetch role-based menu
//     // const menuQuery = `
//     //   SELECT m.*, r.privs
//     //   FROM "Menus" m
//     //   INNER JOIN "RoleMenuRights" r ON m.id = r.menu_id
//     //   WHERE m.status = 1 AND r.role_id = $1
//     //   ORDER BY m.position ASC;
//     // `;
//     // const menuResult = await pool.query(menuQuery, [user.role]);
//     // const menu = menuResult.rows;

//     // Step 3: Create JWT
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     return res.status(200).json({
//       message: "Login successful via Clerk",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         menu:"",
//       },
//     });

//   } catch (err) {
//     console.error("❌ Clerk Auth Error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const clerkAuth = async (req, res) => {
  try {
    // 1. Extract and validate token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const authtoken = authHeader.split(" ")[1];

    // 2. Verify Clerk JWT
    const { sub: clerkUserId } = await verifyToken(authtoken, {
      secretKey: CLERK_SECRET_KEY,
    });

    // 3. Get user info from request
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // 4. Check if user exists
    const checkQuery = `SELECT * FROM "Users" WHERE email = $1`;
    const checkResult = await pool.query(checkQuery, [email]);

    let user;
    let menu = [];

    if (checkResult.rows.length > 0) {
      user = checkResult.rows[0];

      // ✅ Step 5: Fetch role-based menu if role != 0
      if (user.role !== 0) {
        const menuQuery = `
          SELECT m.*, r.privs
          FROM "Menus" m
          INNER JOIN "RoleMenuRights" r ON m.id = r.menu_id
          WHERE m.status = 1 AND r.role_id = $1
          ORDER BY m.position ASC;
        `;
        const menuResult = await pool.query(menuQuery, [user.role]);
        menu = menuResult.rows;
      }
    } else {
      // 6. Create user if not found
      const insertQuery = `
        INSERT INTO "Users" (email, name, clerk_id, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *;
      `;
      const insertValues = [email, name || "Guest", clerkUserId, 0];
      const insertResult = await pool.query(insertQuery, insertValues);
      user = insertResult.rows[0];
    }


    // Generate JWT
    let token = generateToken(user, "1h");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        menu: menu || [],
      },
    });
  } catch (error) {
    console.error("❌ Clerk Auth Error:", error.message);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

//fetch menu against user role
const getUserMenu = async (role) => {
  const menuQuery = `
    SELECT 
      m.*,
      r.privs
    FROM "Menus" m
    INNER JOIN "RoleMenuRights" r ON m.id = r.menu_id
    WHERE m.status = 1 AND r.role_id = $1
    ORDER BY m.position ASC;
  `;

  const menuResult = await pool.query(menuQuery, [role]);
  return menuResult.rows;
};


const generateToken = (user, expiry_time = "1h") => {
  const JWT_SECRET_02 = process.env.JWT_SECRET; // Make sure JWT_SECRET is set in your environment variables

  if (!JWT_SECRET_02) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET_02,
    { expiresIn: expiry_time }
  );

  return token;
};