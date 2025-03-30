import { pool } from '../db/db.js';
import { userJoin } from "../helpers/userJoin.js";

// GET /services - Retrieve all services with service type names
export const getAllServices = async (req, res) => {
  try {
    const userId = req.query.userId || null;

    // Only get selected user fields for this route
    const { joinClause, userFields } = userJoin("s.created_by", [
      "name",
      "email",
      "role",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "postal_code",
      "company_name",
      "website",
      "service_category",
      "years_of_experience",
      "coverage_area",
      "issuingAuthority",
      "specialties",
      "affiliations",
    ]);

    const baseQuery = `
      SELECT 
        s.id AS service_id,
        s.service_name,
        s.description,
        s.created_at,
        s.service_type_id,
        st.service_type_name,
        ${userFields.join(",\n        ")}
      FROM "Services" s
      JOIN "ServiceTypes" st ON s.service_type_id = st.id
      ${joinClause}
    `;

    const finalQuery = userId
      ? `${baseQuery} WHERE s.created_by = $1`
      : baseQuery;

    const result = userId
      ? await pool.query(finalQuery, [userId])
      : await pool.query(finalQuery);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  
// GET /services/:serviceId - Retrieve a specific service by ID
export const getServiceById = async (req, res) => {
    const { serviceId } = req.params;
    try {
      const result = await pool.query('SELECT * FROM "Services" WHERE id = $1', [serviceId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error retrieving service:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// POST /services - Create a new service
export const createService = async (req, res) => {
  const { service_name, description, created_by } = req.body;

  // if (!service_name || !created_by) {
  //   return res.status(400).json({ error: 'Missing required fields: service_type_name, service_name, or created_by.' });
  // }

  try {
    // 1. Insert into ServiceTypes
    const serviceTypeResult = await pool.query(
      `INSERT INTO "ServiceTypes" (id, service_type_name, created_at,"updatedAt")
       VALUES (gen_random_uuid(), $1, NOW(), NOW()) 
       RETURNING id`,
      [service_name]
    );

    const service_type_id = serviceTypeResult.rows[0].id;

    // 2. Insert into Services using the new service_type_id
    const serviceResult = await pool.query(
      `INSERT INTO "Services" (id, service_name, description, service_type_id, created_by, created_at,"updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) 
       RETURNING *`,
      [service_name, description, service_type_id, created_by]
    );

    res.status(201).json(serviceResult.rows[0]);
  } catch (error) {
    console.error('Error creating service with type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

// PUT /services/:serviceId - Update a service by ID
export const updateService = async (req, res) => {
    const { serviceId } = req.params;
    const { service_name, description, service_type_id } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "Services" SET service_name = $1, description = $2, service_type_id = $3 WHERE id = $4 RETURNING *',
        [service_name, description, service_type_id, serviceId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// DELETE /services/:serviceId - Delete a service by ID
export const deleteService = async (req, res) => {
    const { serviceId } = req.params;
    try {
      const result = await pool.query('DELETE FROM "Services" WHERE id = $1 RETURNING *', [serviceId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


export const getServicesWithType = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.id, s.service_name, s.description, s.created_at, 
               st.service_type_name 
        FROM "Services" s
        JOIN "ServiceTypes" st ON s.service_type_id = st.id
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error retrieving services with types:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  