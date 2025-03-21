import { pool } from '../db/db.js';

// Retrieve all property media
export const getAllPropertyMedia = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PropertyMedia');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving property media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a specific property media by ID
export const getPropertyMediaById = async (req, res) => {
  const { mediaId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM PropertyMedia WHERE id = $1', [mediaId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property media not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving property media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Upload new property media
export const uploadPropertyMedia = async (req, res) => {
  const { property_id, media_type, media_url } = req.body;

  if (!property_id || !media_type || !media_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO PropertyMedia (id, property_id, media_type, media_url, created_at) VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *',
      [property_id, media_type, media_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading property media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing property media by ID
export const updatePropertyMedia = async (req, res) => {
  const { mediaId } = req.params;
  const { media_type, media_url } = req.body;

  try {
    const result = await pool.query(
      'UPDATE PropertyMedia SET media_type = $1, media_url = $2, created_at = NOW() WHERE id = $3 RETURNING *',
      [media_type, media_url, mediaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property media not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete property media by ID
export const deletePropertyMedia = async (req, res) => {
  const { mediaId } = req.params;

  try {
    const result = await pool.query('DELETE FROM PropertyMedia WHERE id = $1 RETURNING *', [mediaId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property media not found' });
    }

    res.status(200).json({ message: 'Property media deleted successfully' });
  } catch (error) {
    console.error('Error deleting property media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
