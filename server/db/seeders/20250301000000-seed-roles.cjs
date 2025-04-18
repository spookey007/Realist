'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'Admin',
        description: 'System administrator with full access',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Real Estate Agent',
        description: 'Real estate professional who can manage properties and services',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Contractor',
        description: 'Service provider who can offer and manage services',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 0,
        name: 'Guest',
        description: 'Guest user with limited access',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
}; 