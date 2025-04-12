import { pool } from '../db/db.js';

// GET /service-types
export const getAllServiceTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "ServiceTypes"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving service types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /service-types/:serviceTypeId
export const getServiceTypeById = async (req, res) => {
  const { serviceTypeId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "ServiceTypes" WHERE id = $1', [serviceTypeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service type not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving service type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /service-types
export const createServiceType = async (req, res) => {
  const { service_type_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "ServiceTypes" (id, service_type_name, created_at) VALUES (gen_random_uuid(), $1, NOW()) RETURNING *',
      [service_type_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /service-types/:serviceTypeId
export const updateServiceType = async (req, res) => {
  const { serviceTypeId } = req.params;
  const { service_type_name, status } = req.body;

  try {
    // If status is being changed to 0, check for linked services
    if (parseInt(status) === 0) {
      const serviceCheckQuery = `
        SELECT COUNT(*) FROM "Services" 
        WHERE service_type_id = $1
      `;
      const serviceCheckResult = await pool.query(serviceCheckQuery, [serviceTypeId]);

      const count = parseInt(serviceCheckResult.rows[0].count);
      if (count > 0) {
        return res.status(400).json({
          error: 'This service type is in use. Please delete related services before deactivating.',
        });
      }
    }

    // Proceed with update
    const result = await pool.query(
      `UPDATE "ServiceTypes"
       SET service_type_name = $1, status = $2
       WHERE id = $3
       RETURNING *`,
      [service_type_name, status, serviceTypeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service type not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error updating service type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /service-types/:serviceTypeId
export const deleteServiceType = async (req, res) => {
  const { serviceTypeId } = req.params;
  try {
    const result = await pool.query('DELETE FROM "ServiceTypes" WHERE id = $1 RETURNING *', [serviceTypeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service type not found' });
    }
    res.status(200).json({ message: 'Service type deleted successfully' });
  } catch (error) {
    console.error('Error deleting service type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
