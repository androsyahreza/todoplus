"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NotificationReads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NotificationReads.init(
    {
      is_read: DataTypes.BOOLEAN,
      user_id: DataTypes.INTEGER,
      notification_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NotificationReads",
    }
  );
  return NotificationReads;
};
