"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users, {
        foreignKey: {
          name: "user_id",
        },
        as: "Profiles",
      });
    }
  }
  Profiles.init(
    {
      image: DataTypes.STRING,
      username: DataTypes.STRING,
      description: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      date_of_birth: DataTypes.DATEONLY,
      gender: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profiles",
    }
  );
  return Profiles;
};
