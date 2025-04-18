import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false  // Set to `true` only if you're using verified certs
  }
});


export { pool };
