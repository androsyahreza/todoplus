const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const NotificationService = require("../../database/services/notification.service");
const { NotificationValidator } = require("../validators/validator");
const status = require("http-status");

const sendNotifications = async () => {
  try {
    const task = await NotificationService.TaskIndex();
    task.forEach(async (task) => {
      await NotificationService.SendNotification(task.title, task.user_id);
      console.log("Notifications Successfully Sent");
    });
  } catch (error) {
    console.log(error);
  }
};

const viewNotification = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notification = await NotificationService.ViewNotification(userId);
    res.status(status.OK).send(SuccessResponse(status.OK, null, notification));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const readNotification = async (req, res) => {
  try {
    const notificationValidate = NotificationValidator.validate(req.body);
    const notificationValidateError = notificationValidate.error;
    if (notificationValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, notificationValidateError.details));
    } else {
      const { notification_id, user_id } = req.body;
      await NotificationService.ReadNotification(notification_id, user_id);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "notification Has Been Read"));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};
module.exports = {
  sendNotifications,
  viewNotification,
  readNotification,
};
