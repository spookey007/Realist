'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // UserRoles belongs to User and Role
      UserRole.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      UserRole.belongsTo(models.Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
    }
  }

  UserRole.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserRole',
    timestamps: true
  });

  return UserRole;
};
