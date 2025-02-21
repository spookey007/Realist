module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_menu_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      menu_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permission_level: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Defines the level of permission: 'view', 'edit', 'delete', etc.",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_menu_permissions');
  }
};
