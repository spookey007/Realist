export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Menus", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      href: { type: Sequelize.STRING, allowNull: false },
      icon: { type: Sequelize.STRING, allowNull: false },
      parent_menu_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: "Menus", key: "id" }, onDelete: "SET NULL" },
      status: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Menus");
  },
};
