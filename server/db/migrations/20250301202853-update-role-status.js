'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Roles', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false, // No default value, must be provided explicitly
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Roles', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // This is the rollback, adding defaultValue back
    });
  }
};
