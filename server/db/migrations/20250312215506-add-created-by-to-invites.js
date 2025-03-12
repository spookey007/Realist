'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invites', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false if you want to enforce this field
      references: {
        model: 'Users', // name of the target table
        key: 'id'       // key in the target table that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // or 'CASCADE' or 'RESTRICT' depending on your logic
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Invites', 'created_by');
  }
};
