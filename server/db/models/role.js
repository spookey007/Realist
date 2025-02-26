'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'roleId' }); // Assuming you have a User model
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: true
  });

  return Role;
};
