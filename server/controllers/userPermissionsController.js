import { pool } from '../db/db.js';

// Create or update user permissions
export const setUserPermissions = async (req, res) => {
  const { userId, permissions } = req.body;

  const client = await pool.connect(); // Acquire a client from the pool
  try {
    await client.query('BEGIN'); // Start a transaction

    // First, delete existing permissions
    await client.query('DELETE FROM "user_menu_permissions" WHERE user_id = $1;', [userId]);

    // Then, insert new permissions
    const permissionQueries = permissions.map((permission) => {
      return client.query(`
        INSERT INTO "user_menu_permissions" (user_id, menu_key, permission_level)
        VALUES ($1, $2, $3);
      `, [userId, permission.menu_key, permission.permission_level]);
    });

    await Promise.all(permissionQueries);

    await client.query('COMMIT'); // Commit the transaction
    res.status(200).json({ message: 'User permissions updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Error updating user permissions:', error);
    res.status(500).json({ message: 'Failed to update user permissions' });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Get permissions for a user
export const getUserPermissions = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = 'SELECT * FROM "user_menu_permissions" WHERE user_id = $1;';
    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No permissions found for this user' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Failed to retrieve user permissions' });
  }
};
