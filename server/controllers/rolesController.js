import { pool } from '../db/db.js';

// Create a new role
export const createRole = async (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  try {
    // Ensure `status` is always provided, default to `1` (or any value you prefer)
    const roleStatus = status !== undefined ? status : 1;

    const query = `
      INSERT INTO "Roles" (name, description, status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, description, status;
    `;
    const values = [name, description || null, roleStatus];

    const result = await pool.query(query, values);
    const role = result.rows[0];

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
};


// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const query = 'SELECT id, name, description,status, "createdAt", "updatedAt" FROM "Roles";';
    const result = await pool.query(query);

    res.status(200).json({ roles: result.rows });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to retrieve roles' });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Role ID is required' });
  }

  try {
    const query = 'SELECT id, name, description, "createdAt", "updatedAt" FROM "Roles" WHERE "id" = $1;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ role: result.rows[0] });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ message: 'Failed to retrieve role' });
  }
};

// Update role details
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Role ID is required' });
  }

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    const query = `
      UPDATE "Roles"
      SET ${fields.join(', ')}, "updatedAt" = NOW()
      WHERE "id" = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updatedData)];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', role: result.rows[0] });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

// Delete role by ID
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Role ID is required' });
  }

  try {
    const query = 'UPDATE "Roles" SET "status" = 0 WHERE "id" = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting role:', error);
    res.status(500).json({ message: 'Failed to soft delete role' });
  }
};

