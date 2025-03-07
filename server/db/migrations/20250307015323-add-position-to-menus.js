"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Menus", "position", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Set a default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Menus", "position");
  },
};
