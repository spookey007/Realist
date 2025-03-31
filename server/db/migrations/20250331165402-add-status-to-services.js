'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'status', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'status');
  }
};
