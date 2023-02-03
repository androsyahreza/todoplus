"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifications.belongsTo(models.Users, {
        foreignKey: {
          name: "user_id",
        },
        as: "Notifications",
      });
      Notifications.belongsToMany(models.Users, {
        through: "NotificationReads",
        foreignKey: {
          name: "notification_id",
        },
        as: "UsersNotification",
      });
    }
  }
  Notifications.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notifications",
    }
  );
  return Notifications;
};
