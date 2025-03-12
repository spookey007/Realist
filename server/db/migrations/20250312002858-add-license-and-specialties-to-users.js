'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'licenseNumber', {
      type: Sequelize.STRING,
      allowNull: true, // Set to true if not required immediately
    });

    await queryInterface.addColumn('Users', 'issuingAuthority', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'specialties', {
      type: Sequelize.JSONB, // Storing array of strings as JSONB
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'affiliations', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'licenseNumber');
    await queryInterface.removeColumn('Users', 'issuingAuthority');
    await queryInterface.removeColumn('Users', 'specialties');
    await queryInterface.removeColumn('Users', 'affiliations');
  }
};
