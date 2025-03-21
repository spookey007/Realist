import { pool } from '../db/db.js';

// Retrieve all property inspection reports
export const getAllInspectionReports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PropertyInspectionReports');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving inspection reports:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a specific property inspection report by ID
export const getInspectionReportById = async (req, res) => {
  const { reportId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM PropertyInspectionReports WHERE id = $1', [reportId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspection report not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving inspection report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new property inspection report
export const createInspectionReport = async (req, res) => {
  const { property_id, inspection_report } = req.body;

  if (!property_id || !inspection_report) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO PropertyInspectionReports (id, property_id, inspection_report, created_at) VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING *',
      [property_id, inspection_report]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating inspection report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing property inspection report by ID
export const updateInspectionReport = async (req, res) => {
  const { reportId } = req.params;
  const { inspection_report } = req.body;

  try {
    const result = await pool.query(
      'UPDATE PropertyInspectionReports SET inspection_report = $1, created_at = NOW() WHERE id = $2 RETURNING *',
      [inspection_report, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspection report not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inspection report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a property inspection report by ID
export const deleteInspectionReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const result = await pool.query('DELETE FROM PropertyInspectionReports WHERE id = $1 RETURNING *', [reportId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspection report not found' });
    }

    res.status(200).json({ message: 'Inspection report deleted successfully' });
  } catch (error) {
    console.error('Error deleting inspection report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
