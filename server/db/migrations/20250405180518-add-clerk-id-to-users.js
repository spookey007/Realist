'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'clerk_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true, // Optional: ensures one-to-one with Clerk
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'clerk_id');
  }
};
