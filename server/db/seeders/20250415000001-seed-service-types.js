'use strict';
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface, Sequelize) {
    const serviceTypes = [
      {
        id: uuidv4(),
        service_type_name: 'Home Inspection',
        status: 1,
        created_at: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        service_type_name: 'Property Maintenance',
        status: 1,
        created_at: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        service_type_name: 'Renovation',
        status: 1,
        created_at: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        service_type_name: 'Landscaping',
        status: 1,
        created_at: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        service_type_name: 'Cleaning',
        status: 1,
        created_at: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('ServiceTypes', serviceTypes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ServiceTypes', null, {});
  }
}; 