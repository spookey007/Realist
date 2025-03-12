'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invites', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()'), // or 'uuid_generate_v4()' if using that extension
      unique: true, // Optional: make sure it's unique
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invites', 'uuid');
  }
};
