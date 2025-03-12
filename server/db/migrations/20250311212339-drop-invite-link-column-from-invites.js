'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Drop 'invite_link' column
    await queryInterface.removeColumn('Invites', 'invite_link');
  },

  async down(queryInterface, Sequelize) {
    // ✅ Re-add 'invite_link' column in case you want to rollback
    await queryInterface.addColumn('Invites', 'invite_link', {
      type: Sequelize.STRING, // You can change this to VARCHAR, TEXT if needed
      allowNull: true, // Set to true/false based on previous definition
    });
  }
};
