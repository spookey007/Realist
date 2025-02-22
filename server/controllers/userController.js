import { pool } from '../db/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;
 
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

function generateNameFromEmail(email) {
  if (!email.includes('@')) return 'Invalid Email';

  const username = email.split('@')[0]; // Get the part before '@'
  const words = username.replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/); // Remove special chars & split into words

  // Capitalize each word and join them into a name
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
// Create a new user
export const createUser = async (req, res) => {
  const {email, password } = req.body;
  let name;
  name = generateNameFromEmail(email);
  const hashedPassword = await hashPassword(password);
  try {
    const query = `
      INSERT INTO "Users" (name, email, encrypted_password,"createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id;
    `;
    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);

    const userId = result.rows[0].id;

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "Users"
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE "id" = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updatedData)];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const query = 'SELECT * FROM "Users";';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM "Users" WHERE "id" = $1;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received email:', email);
  console.log('Received password:', password); // Check if this is undefined or empty

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const query = 'SELECT * FROM "Users" WHERE "email" = $1;';
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    console.log('User from DB:', user);

    if (!user.encrypted_password) {
      return res.status(500).json({ message: 'User record is missing a password' });
    }

    // Compare plain password with hashed password from DB
    const isMatch = await bcrypt.compare(password, user.encrypted_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
};
