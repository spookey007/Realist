'use strict';
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface, Sequelize) {
    // First, get all service type IDs
    const serviceTypes = await queryInterface.sequelize.query(
      `SELECT id FROM "ServiceTypes" WHERE status = 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (serviceTypes.length === 0) {
      console.log('No service types found. Please run the service types seeder first.');
      return;
    }

    const services = [];
    
    // Create services for each service type
    serviceTypes.forEach(serviceType => {
      // Create 2-3 services for each service type
      const numServices = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numServices; i++) {
        const serviceName = getServiceName(serviceType.id, i);
        services.push({
          id: uuidv4(),
          service_name: serviceName,
          description: getServiceDescription(serviceType.id, i),
          service_type_id: serviceType.id,
          created_by: 1, // Assuming user ID 1 exists (admin)
          status: 1,
          created_at: new Date(),
          updatedAt: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('Services', services, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', null, {});
  }
};

// Helper functions to generate service names and descriptions
function getServiceName(serviceTypeId, index) {
  // Get service type name
  const serviceTypeNames = {
    'Home Inspection': ['Full Home Inspection', 'Pre-Purchase Inspection', 'New Construction Inspection'],
    'Property Maintenance': ['Regular Maintenance', 'Emergency Repair', 'Seasonal Maintenance'],
    'Renovation': ['Kitchen Renovation', 'Bathroom Renovation', 'Whole House Renovation'],
    'Landscaping': ['Garden Design', 'Lawn Maintenance', 'Hardscaping'],
    'Cleaning': ['Regular Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning']
  };

  // Find the service type name based on ID
  let serviceTypeName = 'General Service';
  for (const [name, services] of Object.entries(serviceTypeNames)) {
    if (services.length > index) {
      serviceTypeName = name;
      break;
    }
  }

  // Return a service name based on the service type
  const serviceNames = serviceTypeNames[serviceTypeName] || ['General Service'];
  return serviceNames[index % serviceNames.length];
}

function getServiceDescription(serviceTypeId, index) {
  const descriptions = [
    'Professional service with attention to detail and customer satisfaction.',
    'Comprehensive service covering all aspects of the job with quality results.',
    'Expert service delivered with efficiency and care.',
    'Thorough service ensuring all requirements are met with precision.',
    'Reliable service performed by experienced professionals.'
  ];
  
  return descriptions[index % descriptions.length];
} 