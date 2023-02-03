"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Goals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Goals.belongsToMany(models.Users, {
        through: "UserGoals",
        foreignKey: {
          name: "goal_id",
        },
        as: "Users",
      });
      Goals.hasMany(models.Tasks, {
        foreignKey: {
          name: "goal_id",
        },
        as: "Tasks",
      });
    }
  }
  Goals.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      goal_owner: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Goals",
    }
  );
  return Goals;
};
