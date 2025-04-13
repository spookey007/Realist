const { pool } = require('./db.js');
const fs = require('fs');
const path = require('path');

async function createServiceTypesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_type_name VARCHAR(255) NOT NULL,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Service types table created successfully');
  } catch (error) {
    console.error('Error creating service types table:', error);
    throw error;
  }
}

async function createServicesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_name VARCHAR(255) NOT NULL,
        description TEXT,
        service_type_id UUID REFERENCES service_types(id),
        created_by UUID,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Services table created successfully');
  } catch (error) {
    console.error('Error creating services table:', error);
    throw error;
  }
}

async function runMigrations() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection established successfully.');

    // Run migrations in order
    console.log('Creating service types table...');
    await createServiceTypesTable();

    console.log('Creating services table...');
    await createServicesTable();

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migrations
runMigrations(); 