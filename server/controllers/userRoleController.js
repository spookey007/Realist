import { pool } from '../db/db.js';

// Create a new user-role association
export const createUserRole = async (req, res) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    return res.status(400).json({ message: 'User ID and Role ID are required' });
  }

  try {
    const query = `
      INSERT INTO "UserRoles" (userId, roleId, "createdAt", "updatedAt")
      VALUES ($1, $2, NOW(), NOW()) RETURNING id, userId, roleId;
    `;
    const values = [userId, roleId];
    const result = await pool.query(query, values);

    const userRole = result.rows[0];

    res.status(201).json({ message: 'User-Role association created successfully', userRole });
  } catch (error) {
    console.error('Error creating user-role:', error);
    res.status(500).json({ message: 'Failed to create user-role' });
  }
};

// Get all user-role associations
export const getAllUserRoles = async (req, res) => {
  try {
    const query = 'SELECT * FROM "UserRoles";';
    const result = await pool.query(query);
    res.status(200).json({ userRoles: result.rows });
  } catch (error) {
    console.error('Error fetching user-roles:', error);
    res.status(500).json({ message: 'Failed to retrieve user-role associations' });
  }
};

// Get user-role association by ID
export const getUserRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'UserRole ID is required' });
  }

  try {
    const query = 'SELECT * FROM "UserRoles" WHERE "id" = $1;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User-role association not found' });
    }

    res.status(200).json({ userRole: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user-role:', error);
    res.status(500).json({ message: 'Failed to retrieve user-role association' });
  }
};

// Update user-role association
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'UserRole ID is required' });
  }

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "UserRoles"
      SET ${fields.join(', ')}, "updatedAt" = NOW()
      WHERE "id" = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updatedData)];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User-role association not found' });
    }

    res.status(200).json({ message: 'User-role updated successfully', userRole: result.rows[0] });
  } catch (error) {
    console.error('Error updating user-role:', error);
    res.status(500).json({ message: 'Failed to update user-role' });
  }
};

// Delete user-role association by ID
export const deleteUserRole = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'UserRole ID is required' });
  }

  try {
    const query = 'DELETE FROM "UserRoles" WHERE "id" = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User-role association not found' });
    }

    res.status(200).json({ message: 'User-role association deleted successfully' });
  } catch (error) {
    console.error('Error deleting user-role:', error);
    res.status(500).json({ message: 'Failed to delete user-role' });
  }
};
