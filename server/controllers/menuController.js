import { pool } from "../db/db.js";

// Create a new menu
export const createMenu = async (req, res) => {
    const { name, href, icon, parent_menu_id, status, position } = req.body;
  
    if (!name || !href || !icon || position === undefined) {
      return res.status(400).json({ message: "Name, href, icon, and position are required" });
    }
  
    try {
      const query = `
        INSERT INTO "Menus" (name, href, icon, parent_menu_id, status, position, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
      `;
      const values = [name, href, icon, parent_menu_id || null, status !== undefined ? status : 1, position];
  
      const result = await pool.query(query, values);
      res.status(201).json({ message: "Menu created successfully", menu: result.rows[0] });
    } catch (error) {
      console.error("Error creating menu:", error);
      res.status(500).json({ message: "Failed to create menu" });
    }
  };
  

// Get all menus
export const getAllMenus = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Menus" ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
};

export const getMenusSidebar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Menus"  WHERE status=1 ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
};

// Get a single menu by ID
export const getMenuById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Menus" WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};

// Update a menu
export const updateMenu = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    
    if (!id) return res.status(400).json({ message: "Menu ID is required" });
    if (Object.keys(updatedData).length === 0) return res.status(400).json({ message: "No fields to update" });
  
    try {
      // Dynamically create the SET fields
    const fields = Object.keys(updatedData).map((key, idx) => `"${key}" = $${idx + 2}`);
    console.log(fields)
      const query = `
        UPDATE "Menus"
        SET ${fields.join(', ')}, "updated_at" = NOW()
        WHERE "id" = $1
        RETURNING *;
      `;
      console.log(query)
      const values = [id, ...Object.values(updatedData)];
  
      const result = await pool.query(query, values);
      if (result.rows.length === 0) return res.status(404).json({ message: "Menu not found" });
  
      res.status(200).json({ message: "Menu updated successfully", menu: result.rows[0] });
    } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).json({ message: "Failed to update menu" });
    }
  };
  

// Delete a menu
export const deleteMenu = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM "Menus" WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Failed to delete menu" });
  }
};
