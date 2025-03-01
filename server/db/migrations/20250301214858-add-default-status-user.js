'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // ✅ Set default value to 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: null, // Rollback (removes default)
    });
  }
};
