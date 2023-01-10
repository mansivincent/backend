'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    static associate(models) {
      models.Tasks.belongsTo(models.Users,{
        foreignKey:{
          allowNull:false
        }
      })
    }
  }
  Tasks.init({
    Name: DataTypes.STRING,
    Description: DataTypes.STRING,
    Deadline: DataTypes.DATE,
    Done: DataTypes.BOOLEAN,
    ID_Users: DataTypes.INTEGER,
    UpVote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tasks',
  });
  return Tasks;
};