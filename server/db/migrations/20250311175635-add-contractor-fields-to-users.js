'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'company_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'service_category', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'years_of_experience', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'coverage_area', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'license_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'insurance_policy', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'references', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'files', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'company_name');
    await queryInterface.removeColumn('Users', 'website');
    await queryInterface.removeColumn('Users', 'service_category');
    await queryInterface.removeColumn('Users', 'years_of_experience');
    await queryInterface.removeColumn('Users', 'coverage_area');
    await queryInterface.removeColumn('Users', 'license_number');
    await queryInterface.removeColumn('Users', 'insurance_policy');
    await queryInterface.removeColumn('Users', 'references');
    await queryInterface.removeColumn('Users', 'description');
    await queryInterface.removeColumn('Users', 'files');
  },
};
