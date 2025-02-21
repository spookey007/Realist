import { pool } from '../db/db.js';

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password, phone, address, city, state, country, postal_code, lat, lon, profile_picture_url,status,role } = req.body;

  try {
    const query = `
      INSERT INTO "users" (name, email, encrypted_password, phone, address, city, state, country, postal_code, lat, lon, profile_picture_url, user_status, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14, NOW(), NOW()) RETURNING id;
    `;
    const values = [name, email, password, phone, address, city, state, country, postal_code, lat, lon, profile_picture_url,status,role];
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
      UPDATE "users"
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
    const query = 'SELECT * FROM "users";';
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
    const query = 'SELECT * FROM "users" WHERE "id" = $1;';
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