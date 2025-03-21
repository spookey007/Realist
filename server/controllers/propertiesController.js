import { pool } from '../db/db.js';

// Retrieve all properties
export const getAllProperties = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Properties"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving properties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a specific property by ID
export const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM Properties WHERE id = $1', [propertyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new property
export const createProperty = async (req, res) => {
  const { owner_id, address, property_type, price, details } = req.body;

  if (!owner_id || !address || !property_type || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO "Properties" (id, owner_id, address, property_type, price, details, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [owner_id, address, property_type, price, details]
    );

    res.status(201).json({
      message: 'Property created successfully!',
      property: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update an existing property by ID
export const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { address, property_type, price, details } = req.body;

  try {
    const result = await pool.query(
      'UPDATE Properties SET address = $1, property_type = $2, price = $3, details = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [address, property_type, price, details, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a property by ID
export const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const result = await pool.query('DELETE FROM Properties WHERE id = $1 RETURNING *', [propertyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  