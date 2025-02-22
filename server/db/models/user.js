'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    status: DataTypes.INTEGER,
    role: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lon: DataTypes.DECIMAL,
    last_login: DataTypes.DATE,
    profile_picture_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};