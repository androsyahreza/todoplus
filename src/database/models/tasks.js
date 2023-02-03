"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tasks.belongsTo(models.Goals, {
        foreignKey: {
          name: "goal_id",
        },
        as: "Tasks",
      });
    }
  }
  Tasks.init(
    {
      title: DataTypes.STRING,
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      link: DataTypes.STRING,
      note: DataTypes.TEXT,
      is_finished: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Tasks",
    }
  );
  return Tasks;
};
