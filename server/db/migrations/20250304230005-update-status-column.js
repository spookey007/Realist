module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove ENUM column
      await queryInterface.removeColumn("Invites", "status", { transaction });

      // Add new INTEGER column
      await queryInterface.addColumn(
        "Invites",
        "status",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1, // Default to 'pending' (1)
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove INTEGER column
      await queryInterface.removeColumn("Invites", "status", { transaction });

      // Re-add ENUM column
      await queryInterface.addColumn(
        "Invites",
        "status",
        {
          type: Sequelize.ENUM("pending", "joined"),
          allowNull: false,
          defaultValue: "pending",
        },
        { transaction }
      );
    });
  },
};
