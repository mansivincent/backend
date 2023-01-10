const db = {};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      models.Users.hasMany(models.Tasks);
    }
  }
  Users.init({
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    Pseudo: DataTypes.STRING,
    Phone: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};