"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profiles, {
        foreignKey: {
          name: "user_id",
        },
        as: "Profiles",
      });
      Users.belongsToMany(models.Goals, {
        through: "UserGoals",
        foreignKey: {
          name: "user_id",
        },
        as: "Goals",
      });
      Users.belongsToMany(models.Users, {
        through: "Relationships",
        foreignKey: {
          name: "user_id",
        },
        as: "Users",
      });
      Users.belongsToMany(models.Users, {
        through: "Relationships",
        foreignKey: {
          name: "following_id",
        },
        as: "Following",
      });
      Users.hasMany(models.Notifications, {
        foreignKey: {
          name: "user_id",
        },
        as: "Notification",
      });
      Users.belongsToMany(models.Notifications, {
        through: "NotificationReads",
        foreignKey: {
          name: "user_id",
        },
        as: "UsersNotification",
      });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      access_token: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (Merchant, options) => {
          const saltRounds = 10;
          Merchant.password = bcrypt.hashSync(Merchant.password, saltRounds);
        },
        beforeUpdate: (Merchant, options) => {
          const saltRounds = 10;
          Merchant.password = bcrypt.hashSync(Merchant.password, saltRounds);
        },
      },
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
