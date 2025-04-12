'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ServiceTypes', 'status', {
      type: Sequelize.INTEGER,
      defaultValue: 1, // 1 = active, 0 = inactive
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ServiceTypes', 'status');
  }
};
