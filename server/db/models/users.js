'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      // For example:
      // User.hasMany(models.UserPermission);
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    encrypted_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0 = pending, 1 = activated, 2 = deactivated",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0 = admin, 1 = user, 2 = guest",
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: true, // Considered as nullable
    },
    lon: {
      type: DataTypes.DECIMAL,
      allowNull: true, // Considered as nullable
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_login: DataTypes.DATE,
    profile_picture_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Optional: specify your table name
    underscored: true, // Use snake_case in database columns
    timestamps: true,
  });

  return User;
};
