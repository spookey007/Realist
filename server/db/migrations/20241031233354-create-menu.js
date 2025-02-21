module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The name of the menu item.',
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The route path for the menu item.',
      },
      icon: {
        type: Sequelize.STRING,
        comment: 'Icon associated with the menu item, if any.',
      },
      visibility: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Indicates if the menu item is visible to users.',
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID of the parent menu item, if applicable.',
        references: {
          model: 'menu',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('menu');
  }
};
