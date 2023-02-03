const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  sendNotifications,
  viewNotification,
  readNotification,
} = require("../src/app/controllers/notification.controller");
const { NotificationValidator } = require("../src/app/validators/validator");
const NotificationService = require("../src/database/services/notification.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validators/validator", () => ({
  NotificationValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/database/services/goal.service", () => ({
  TaskIndex: jest.fn(),
  SendNotification: jest.fn(),
  ViewNotification: jest.fn(),
  ReadNotification: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
describe("Send Notification test", () => {
  it("Should send notification successfully", async () => {
    NotificationService.TaskIndex = jest.fn().mockResolvedValue([
      { title: "Task 1", user_id: 1 },
      { title: "Task 2", user_id: 2 },
    ]);
    NotificationService.SendNotification = jest.fn().mockResolvedValue({});
    await sendNotifications();
    expect(NotificationService.SendNotification).toHaveBeenCalledWith(
      "Task 1",
      1
    );
    expect(NotificationService.SendNotification).toHaveBeenCalledWith(
      "Task 2",
      2
    );
  });
  it("Should handle error", async () => {
    NotificationService.TaskIndex = jest
      .fn()
      .mockRejectedValue(new Error("Failed to fetch tasks"));
    console.log = jest.fn();
    await sendNotifications();
    expect(console.log).toHaveBeenCalledWith(
      new Error("Failed to fetch tasks")
    );
  });
});
describe("View Notification endpoint", () => {
  const req = {
    params: {
      userId: 1,
    },
  };
  it("Should return 200 if notification successfully viewed", async () => {
    NotificationService.ViewNotification = jest.fn().mockResolvedValue({
      status: 200,
      message: null,
      data: "data"
    });
    await viewNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, null, "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    NotificationService.ViewNotification = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Read Notification endpoint", () => {
  const req = {
    params: {
      userId: "some-user-id",
    },
    body: {
      notification_id: 1,
      user_id: 1,
    },
  };
  it("Should return 400 if notification validation fails", async () => {
    NotificationValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await readNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if notification has been read", async () => {
    NotificationValidator.validate = jest.fn().mockReturnValue({ error: null });
    NotificationService.ReadNotification = jest.fn().mockResolvedValue({
      status: 200,
      message: "notification Has Been Read",
    });
    await readNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "notification Has Been Read")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    NotificationService.ReadNotification = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await readNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
