module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Invites", "role", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Adjust default value if needed
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Invites", "role");
  },
};
