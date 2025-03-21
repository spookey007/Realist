module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PropertyMedia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      property_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      media_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      media_type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PropertyMedia');
  },
};
