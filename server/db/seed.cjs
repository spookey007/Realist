'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/config.cjs');
const { v4: uuidv4 } = require('uuid');
const importedSeedServiceTypes = require('./seeders/20250415000001-seed-service-types.cjs');
const importedSeedServices = require('./seeders/20250415000002-seed-services.cjs');
const { pool } = require('./db.js');

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

async function seedServiceTypesData() {
  const serviceTypes = [
    { id: uuidv4(), service_type_name: 'Home Inspection', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Property Maintenance', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Renovation', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Landscaping', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Cleaning', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Plumbing', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Electrical', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'HVAC', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Roofing', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Painting', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Flooring', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Carpentry', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Masonry', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Pest Control', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Window Installation', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Door Installation', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Fencing', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Deck Building', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Pool Maintenance', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Gutter Cleaning', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Chimney Cleaning', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Appliance Repair', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Garage Door Repair', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Insulation', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Waterproofing', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Asbestos Removal', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Mold Remediation', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Radon Testing', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Lead Paint Removal', status: 1, created_at: new Date(), updatedAt: new Date() },
    { id: uuidv4(), service_type_name: 'Solar Panel Installation', status: 1, created_at: new Date(), updatedAt: new Date() }
  ];

  try {
    for (const serviceType of serviceTypes) {
      await pool.query(
        'INSERT INTO "ServiceTypes" (id, service_type_name, status, created_at, "updatedAt") VALUES ($1, $2, $3, $4, $5)',
        [serviceType.id, serviceType.service_type_name, serviceType.status, serviceType.created_at, serviceType.updatedAt]
      );
    }
    console.log('Service types seeded successfully');
  } catch (error) {
    console.error('Error seeding service types:', error);
    throw error;
  }
}

async function seedServicesData() {
  try {
    // Get all service type IDs
    const serviceTypesResult = await pool.query('SELECT id FROM "ServiceTypes" WHERE status = 1');
    const serviceTypes = serviceTypesResult.rows;

    if (serviceTypes.length === 0) {
      console.log('No service types found. Please run the service types seeder first.');
      return;
    }

    const services = [];
    
    // Create services for each service type
    for (const serviceType of serviceTypes) {
      // Create 30-100 services for each service type
      const numServices = Math.floor(Math.random() * 71) + 30; // Random number between 30 and 100
      console.log(`Creating ${numServices} services for ${serviceType.service_type_name || 'service type'}`);
      
      for (let i = 0; i < numServices; i++) {
        const serviceName = getServiceName(serviceType.id, i);
        services.push({
          id: uuidv4(),
          service_name: serviceName,
          description: getServiceDescription(serviceType.id, i),
          service_type_id: serviceType.id,
          created_by: 1, // Use integer 1 instead of UUID
          status: 1,
          created_at: new Date(),
          updatedAt: new Date()
        });
      }
    }

    console.log(`Total services to create: ${services.length}`);
    
    // Insert services in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < services.length; i += batchSize) {
      const batch = services.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(services.length/batchSize)}`);
      
      for (const service of batch) {
        await pool.query(
          'INSERT INTO "Services" (id, service_name, description, service_type_id, created_by, status, created_at, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [service.id, service.service_name, service.description, service.service_type_id, service.created_by, service.status, service.created_at, service.updatedAt]
        );
      }
    }
    console.log('Services seeded successfully');
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
}

// Helper functions to generate service names and descriptions
function getServiceName(serviceTypeId, index) {
  const serviceTypeNames = {
    'Home Inspection': ['Full Home Inspection', 'Pre-Purchase Inspection', 'New Construction Inspection', 'Radon Testing', 'Mold Inspection'],
    'Property Maintenance': ['Regular Maintenance', 'Emergency Repair', 'Seasonal Maintenance', 'Preventive Maintenance', 'Post-Construction Cleanup'],
    'Renovation': ['Kitchen Renovation', 'Bathroom Renovation', 'Whole House Renovation', 'Basement Finishing', 'Attic Conversion'],
    'Landscaping': ['Garden Design', 'Lawn Maintenance', 'Hardscaping', 'Tree Trimming', 'Irrigation System Installation'],
    'Cleaning': ['Regular Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning', 'Window Cleaning', 'Carpet Cleaning'],
    'Plumbing': ['Leak Repair', 'Drain Cleaning', 'Pipe Replacement', 'Water Heater Installation', 'Sewer Line Repair'],
    'Electrical': ['Wiring Installation', 'Circuit Panel Upgrade', 'Lighting Installation', 'Ceiling Fan Installation', 'Emergency Electrical Repair'],
    'HVAC': ['AC Repair', 'Heating System Installation', 'Ventilation System Cleaning', 'Thermostat Installation', 'Duct Cleaning'],
    'Roofing': ['Roof Repair', 'Roof Replacement', 'Gutter Installation', 'Skylight Installation', 'Roof Inspection'],
    'Painting': ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Deck Staining', 'Wallpaper Removal'],
    'Flooring': ['Hardwood Installation', 'Tile Installation', 'Carpet Installation', 'Laminate Flooring', 'Epoxy Floor Coating'],
    'Carpentry': ['Custom Cabinets', 'Door Installation', 'Window Frame Repair', 'Staircase Construction', 'Built-in Shelving'],
    'Masonry': ['Brick Repair', 'Stone Wall Construction', 'Concrete Patio Installation', 'Chimney Repair', 'Retaining Wall Construction'],
    'Pest Control': ['Rodent Control', 'Insect Extermination', 'Termite Treatment', 'Wildlife Removal', 'Bed Bug Treatment'],
    'Window Installation': ['Window Replacement', 'Window Repair', 'Storm Window Installation', 'Window Sealing', 'Window Frame Repair'],
    'Door Installation': ['Entry Door Installation', 'Garage Door Installation', 'Sliding Door Installation', 'Door Repair', 'Security Door Installation'],
    'Fencing': ['Wood Fence Installation', 'Metal Fence Installation', 'Vinyl Fence Installation', 'Fence Repair', 'Gate Installation'],
    'Deck Building': ['Wood Deck Construction', 'Composite Deck Installation', 'Deck Repair', 'Deck Staining', 'Deck Enclosure'],
    'Pool Maintenance': ['Pool Cleaning', 'Pool Repair', 'Pool Opening', 'Pool Closing', 'Water Chemistry Balancing'],
    'Gutter Cleaning': ['Gutter Cleaning', 'Gutter Repair', 'Gutter Guard Installation', 'Downspout Repair', 'Gutter Replacement'],
    'Chimney Cleaning': ['Chimney Sweeping', 'Chimney Repair', 'Chimney Cap Installation', 'Fireplace Inspection', 'Chimney Lining Installation'],
    'Appliance Repair': ['Refrigerator Repair', 'Washer/Dryer Repair', 'Dishwasher Repair', 'Oven Repair', 'Microwave Repair'],
    'Garage Door Repair': ['Garage Door Spring Replacement', 'Garage Door Opener Repair', 'Garage Door Panel Replacement', 'Garage Door Alignment', 'Garage Door Installation'],
    'Insulation': ['Attic Insulation', 'Wall Insulation', 'Basement Insulation', 'Crawl Space Insulation', 'Spray Foam Insulation'],
    'Waterproofing': ['Basement Waterproofing', 'Foundation Waterproofing', 'Crawl Space Waterproofing', 'Roof Waterproofing', 'Deck Waterproofing'],
    'Asbestos Removal': ['Asbestos Inspection', 'Asbestos Abatement', 'Asbestos Testing', 'Asbestos Encapsulation', 'Asbestos Disposal'],
    'Mold Remediation': ['Mold Inspection', 'Mold Removal', 'Mold Prevention', 'Mold Testing', 'Mold Damage Repair'],
    'Radon Testing': ['Radon Testing', 'Radon Mitigation', 'Radon Monitoring', 'Radon Inspection', 'Radon System Installation'],
    'Lead Paint Removal': ['Lead Paint Inspection', 'Lead Paint Abatement', 'Lead Paint Encapsulation', 'Lead Paint Testing', 'Lead Paint Disposal'],
    'Solar Panel Installation': ['Solar Panel Installation', 'Solar Panel Maintenance', 'Solar Battery Installation', 'Solar Panel Repair', 'Solar System Design']
  };

  let serviceTypeName = 'General Service';
  for (const [name, services] of Object.entries(serviceTypeNames)) {
    if (services.length > index) {
      serviceTypeName = name;
      break;
    }
  }

  const serviceNames = serviceTypeNames[serviceTypeName] || ['General Service'];
  return serviceNames[index % serviceNames.length];
}

function getServiceDescription(serviceTypeId, index) {
  const descriptions = [
    'Professional service with attention to detail and customer satisfaction.',
    'Comprehensive service covering all aspects of the job with quality results.',
    'Expert service delivered with efficiency and care.',
    'Thorough service ensuring all requirements are met with precision.',
    'Reliable service performed by experienced professionals.',
    'High-quality service with a focus on long-term durability and satisfaction.',
    'Skilled service that addresses all your specific needs and concerns.',
    'Efficient service that minimizes disruption to your daily routine.',
    'Trusted service with a proven track record of excellence.',
    'Dedicated service that goes above and beyond expectations.'
  ];
  
  return descriptions[index % descriptions.length];
}

async function runSeeders() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection established successfully.');

    // Run seeders in order
    console.log('Running service types seeder...');
    await seedServiceTypesData();
    console.log('Service types seeded successfully.');

    console.log('Running services seeder...');
    await seedServicesData();
    console.log('Services seeded successfully.');

    console.log('All seeders completed successfully.');
  } catch (error) {
    console.error('Error running seeders:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the seeders
runSeeders(); 