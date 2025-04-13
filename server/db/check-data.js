const { pool } = require('./db.js');

async function checkData() {
  try {
    // Check service types
    const serviceTypesResult = await pool.query('SELECT COUNT(*) FROM "ServiceTypes"');
    console.log('Service Types Count:', serviceTypesResult.rows[0].count);
    
    // Check services
    const servicesResult = await pool.query('SELECT COUNT(*) FROM "Services"');
    console.log('Services Count:', servicesResult.rows[0].count);
    
    // Check services by type
    const servicesByTypeResult = await pool.query(`
      SELECT st.id, st.service_type_name, COUNT(s.id) as service_count
      FROM "ServiceTypes" st
      LEFT JOIN "Services" s ON st.id = s.service_type_id
      GROUP BY st.id, st.service_type_name
      ORDER BY st.service_type_name
    `);
    
    console.log('\nServices by Type:');
    servicesByTypeResult.rows.forEach(row => {
      console.log(`${row.service_type_name}: ${row.service_count} services`);
    });
    
    // Check if there are any services with created_by = 1
    const userCheckResult = await pool.query('SELECT COUNT(*) FROM "Users" WHERE id = 1');
    console.log('\nUsers with ID 1:', userCheckResult.rows[0].count);
    
    // Check the first few services
    const sampleServicesResult = await pool.query(`
      SELECT s.id, s.service_name, s.service_type_id, s.created_by, st.service_type_name
      FROM "Services" s
      JOIN "ServiceTypes" st ON s.service_type_id = st.id
      LIMIT 5
    `);
    
    console.log('\nSample Services:');
    sampleServicesResult.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.service_name}, Type: ${row.service_type_name}, Created By: ${row.created_by}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkData(); 