'use strict';

import { Sequelize } from 'sequelize';
import config from '../config/config.cjs';
import { v4 as uuidv4 } from 'uuid';
import seedServiceTypes from './seeders/20250415000001-seed-service-types.js';
import seedServices from './seeders/20250415000002-seed-services.js';

// Get the environment from NODE_ENV or default to development
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
  }
);

async function runSeeders() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Run seeders in order
    console.log('Running service types seeder...');
    await seedServiceTypes.up(sequelize.getQueryInterface(), Sequelize);
    console.log('Service types seeded successfully.');

    console.log('Running services seeder...');
    await seedServices.up(sequelize.getQueryInterface(), Sequelize);
    console.log('Services seeded successfully.');

    console.log('All seeders completed successfully.');
  } catch (error) {
    console.error('Error running seeders:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the seeders
runSeeders(); 