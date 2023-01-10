'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const UpVote=sequelize.define('UpVote',{
    Tasks_id: {
      type: DataTypes.INTEGER,
      references : {
        model:'Tasks',
        key : 'id'
      }
  },
  Users_id:{
    type: DataTypes.INTEGER,
    references:{
      model:'Users',
      key:'id'
    }
  }
  });

  class Upvote extends Model {
    static associate(models) {
      models.Users.belongsToMany(models.Tasks, {
        through: models.UpVote,
        foreignKey: 'Users_id',
        otherKey: 'Task_id',
      });
  
      models.Tasks.belongsToMany(models.Users, {
        through: models.UpVote,
        foreignKey: 'Task_id',
        otherKey: 'Users_id',
      });
  
      models.UpVote.belongsTo(models.Users, {
        foreignKey: 'Users_id',
        as: 'Users',
      });
  
      models.UpVote.belongsTo(models.Tasks, {
        foreignKey: 'Task_id',
        as: 'Tasks',
      });
    }
  }
  Upvote.init({
    Tasks_id: DataTypes.INTEGER,
    Users_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UpVote',
  });
  return Upvote;
};