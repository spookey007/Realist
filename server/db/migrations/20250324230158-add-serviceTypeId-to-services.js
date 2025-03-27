'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'service_type_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'ServiceTypes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'service_type_id');
  }
};
