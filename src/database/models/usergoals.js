"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserGoals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserGoals.init(
    {
      user_id: DataTypes.INTEGER,
      goal_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserGoals",
    }
  );
  return UserGoals;
};
