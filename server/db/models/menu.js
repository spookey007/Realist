'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // Define associations here
      // For example:
      // Menu.hasMany(models.UserPermission);
    }
  }

  Menu.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: DataTypes.STRING,
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow for nested menus
    },
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menus', // Optional: specify your table name
    underscored: true, // Use snake_case in database columns
    timestamps: true,
  });

  return Menu;
};
