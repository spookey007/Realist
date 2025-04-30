import { pool } from '../db/db.js';
import { userJoin } from "../helpers/userJoin.js";
import { v4 as uuidv4 } from 'uuid';

// GET /services - Retrieve all services with service type names
const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_limit } = req.query;
    const offset = (page - 1) * limit;

    // Get all service types with accurate count
    const serviceTypesResult = await pool.query(
      `SELECT st.*, 
              (SELECT COUNT(*) 
               FROM "Services" s 
               WHERE s.service_type_id = st.id) as total_count,
              (SELECT COUNT(*) 
               FROM "Services" s 
               WHERE s.service_type_id = st.id) as service_count
       FROM "ServiceTypes" st
       ORDER BY st.service_type_name
       ${user_limit !== undefined && user_limit !== null ? `LIMIT ${user_limit}` : ''}`
    );

    const servicesByType = serviceTypesResult.rows.map(type => ({
      ...type,
      total_count: parseInt(type.total_count) || 0,
      service_count: parseInt(type.service_count) || 0
    }));
    
    // Get all services for all types in a single query
    const servicesResult = await pool.query(
      `SELECT s.*, st.service_type_name
       FROM "Services" s
       LEFT JOIN "ServiceTypes" st ON s.service_type_id = st.id
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const services = await userJoin(servicesResult.rows);
    
    // Get total count in a single query
    const countResult = await pool.query('SELECT COUNT(*) FROM "Services"');
    const totalServices = parseInt(countResult.rows[0].count);

    res.json({
      servicesByType,
      services,
      pagination: {
        total: totalServices,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalServices / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

// GET /services/:typeId - Get services by type ID
const getServicesByTypeId = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count for this type
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM "Services" WHERE service_type_id = $1',
      [typeId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated services for this type
    const result = await pool.query(
      `SELECT s.*, st.service_type_name 
       FROM "Services" s
       LEFT JOIN "ServiceTypes" st ON s.service_type_id = st.id
       WHERE s.service_type_id = $1
       ORDER BY s.created_at DESC
       LIMIT $2 OFFSET $3`,
      [typeId, limit, offset]
    );

    res.json({
      services: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services by type:', error);
    res.status(500).json({ message: 'Error fetching services by type' });
  }
};

// GET /services/grouped - Get all services grouped by type
const getAllServicesGroupedByType = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status } = req.query;
    const offset = (page - 1) * limit;

    // Build the base query for service types
    let serviceTypesQuery = `
      SELECT st.*, 
             COUNT(s.id) as service_count
      FROM "ServiceTypes" st
      LEFT JOIN "Services" s ON st.id = s.service_type_id
    `;

    // Add filters if provided
    const queryParams = [];
    let paramCount = 1;
    let whereClause = '';

    if (userId) {
      whereClause += ` AND s.created_by = $${paramCount}`;
      queryParams.push(userId);
      paramCount++;
    }

    if (status !== undefined) {
      whereClause += ` AND s.status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    if (whereClause) {
      serviceTypesQuery += ` WHERE 1=1 ${whereClause}`;
    }

    serviceTypesQuery += ` GROUP BY st.id ORDER BY st.service_type_name`;

    // Get all service types
    const serviceTypesResult = await pool.query(serviceTypesQuery, queryParams);
    const serviceTypes = serviceTypesResult.rows;

    // For each service type, get its services with pagination
    const servicesByType = [];
    let totalServices = 0;

    for (const serviceType of serviceTypes) {
      // Build the services query for this type
      let servicesQuery = `
        SELECT s.*, st.service_type_name
        FROM "Services" s
        LEFT JOIN "ServiceTypes" st ON s.service_type_id = st.id
        WHERE s.service_type_id = $1
      `;

      const servicesParams = [serviceType.id];
      let servicesParamCount = 2;

      if (userId) {
        servicesQuery += ` AND s.created_by = $${servicesParamCount}`;
        servicesParams.push(userId);
        servicesParamCount++;
      }

      if (status !== undefined) {
        servicesQuery += ` AND s.status = $${servicesParamCount}`;
        servicesParams.push(status);
        servicesParamCount++;
      }

      servicesQuery += ` ORDER BY s.created_at DESC LIMIT $${servicesParamCount} OFFSET $${servicesParamCount + 1}`;
      servicesParams.push(limit, offset);

      // Get services for this type
      const servicesResult = await pool.query(servicesQuery, servicesParams);
      const services = await userJoin(servicesResult.rows);

      // Get total count for this type
      let countQuery = `
        SELECT COUNT(*) 
        FROM "Services" s
        WHERE s.service_type_id = $1
      `;

      const countParams = [serviceType.id];
      let countParamCount = 2;

      if (userId) {
        countQuery += ` AND s.created_by = $${countParamCount}`;
        countParams.push(userId);
        countParamCount++;
      }

      if (status !== undefined) {
        countQuery += ` AND s.status = $${countParamCount}`;
        countParams.push(status);
        countParamCount++;
      }

      const countResult = await pool.query(countQuery, countParams);
      const typeTotal = parseInt(countResult.rows[0].count);
      totalServices += typeTotal;

      servicesByType.push({
        ...serviceType,
        services,
        total: typeTotal
      });
    }

    res.json({
      serviceTypes,
      servicesByType,
      pagination: {
        total: totalServices,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalServices / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services grouped by type:', error);
    res.status(500).json({ message: 'Error fetching services grouped by type' });
  }
};

// GET /services/:serviceId - Retrieve a specific service by ID
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const result = await pool.query(
      'SELECT * FROM "Services" WHERE id = $1',
      [serviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await userJoin(result.rows);
    res.json(service[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service' });
  }
};

// POST /services - Create a new service
const createService = async (req, res) => {
  try {
    const { service_name, description, service_type_id, status = 1, user_id } = req.body;
    // const created_by = req.user_id || uuidv4(); // Use user ID if available, otherwise generate UUID

    const result = await pool.query(
      `INSERT INTO "Services" (service_name, description, service_type_id, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [service_name, description, service_type_id, status, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service' });
  }
};

// PUT /services/:serviceId - Update a service by ID
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { service_name, description, service_type_id, status } = req.body;

    const result = await pool.query(
      `UPDATE "Services"
       SET service_name = $1, description = $2, service_type_id = $3, status = $4
       WHERE id = $5
       RETURNING *`,
      [service_name, description, service_type_id, status, serviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
};

// DELETE /services/:serviceId - Delete a service by ID
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const result = await pool.query(
      'DELETE FROM "Services" WHERE id = $1 RETURNING *',
      [serviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
};

// GET /services/with-type - Get all services with their type information
const getServicesWithType = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, st.service_type_name 
       FROM "Services" s
       LEFT JOIN "ServiceTypes" st ON s.service_type_id = st.id
       ORDER BY s.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services with type:', error);
    res.status(500).json({ message: 'Error fetching services with type' });
  }
};

// GET /services/by-category/:categoryId - Get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get services for the specified category
    const servicesQuery = `
      SELECT s.*, st.service_type_name
      FROM "Services" s
      LEFT JOIN "ServiceTypes" st ON s.service_type_id = st.id
      WHERE s.service_type_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM "Services" 
      WHERE service_type_id = $1
    `;

    const [servicesResult, countResult] = await Promise.all([
      pool.query(servicesQuery, [categoryId, limit, offset]),
      pool.query(countQuery, [categoryId])
    ]);

    const services = await userJoin(servicesResult.rows);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      services,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ message: 'Error fetching services by category' });
  }
};

// Export all functions using ES module syntax
export {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesWithType,
  getAllServicesGroupedByType,
  getServicesByCategory
};
  