'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {
      // Define associations here
      // For example:
      // UserPermission.belongsTo(models.User);
      // UserPermission.belongsTo(models.Menu);
    }
  }

  UserPermission.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Permissions for user (e.g., 'read', 'write', 'delete')",
    },
  }, {
    sequelize,
    modelName: 'UserPermission',
    tableName: 'user_permissions', // Optional: specify your table name
    underscored: true, // Use snake_case in database columns
    timestamps: true,
  });

  return UserPermission;
};
