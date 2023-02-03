const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  addTask,
  updateTask,
  deleteTask,
} = require("../src/app/controllers/task.controller");
const { TaskValidator } = require("../src/app/validators/validator");
const TaskService = require("../src/database/services/task.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));
jest.mock("../src/app/validators/validator", () => ({
  TaskValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/database/services/profile.service", () => ({
  CreateTask: jest.fn(),
  UpdateTask: jest.fn(),
  DeleteTask: jest.fn(),
  CheckTask: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
describe("Add Task endpoint", () => {
  const req = {
    params: {
      goalId: 1,
    },
    body: {
      title: "title",
      date: "date",
      time: "time",
      link: "link",
      note: "note",
      is_finished: "is_finished",
      goal_id: "goalId",
    },
  };
  it("Should return 400 if task validation fails", async () => {
    TaskValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if task successfully added", async () => {
    TaskValidator.validate = jest.fn().mockReturnValue({
      error: null
    });
    TaskService.CreateTask = jest.fn().mockResolvedValue({
      status: 200,
      message: "Task Successfully Added",
      data: "task",
    });
    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Task Successfully Added", "task")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    TaskService.CreateTask = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Update Task endpoint", () => {
  const req = {
    params: {
      taskId: 1,
    },
    body: {
      title: "title",
      date: "date",
      time: "time",
      link: "link",
      note: "note",
      is_finished: "is_finished",
      goal_id: "goalId",
    },
  };
  it("Should return 404 if task not found", async () => {
    TaskService.CheckTask = jest.fn().mockReturnValue(null);
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Task Not Found, Please Add Task First")
    );
  });
  it("Should return 400 if task validation error", async () => {
    TaskService.CheckTask = jest.fn().mockReturnValue({ error: null });
    TaskValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if task successfully updated", async () => {
    TaskService.CheckTask = jest.fn().mockReturnValue({ error: null });
    TaskValidator.validate = jest.fn().mockReturnValue({ error: null });
    TaskService.UpdateTask = jest.fn().mockResolvedValue({
      status: 200,
      message: "Task Successfully Updated",
    });
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Task Successfully Updated")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    TaskService.UpdateTask = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Delete Task endpoint", () => {
  const req = {
    params: {
      taskId: 1,
    },
  };
  it("Should return 404 if task not found", async () => {
    TaskService.CheckTask = jest.fn().mockReturnValue(null);
    await deleteTask(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Task Not Found, Please Add Task First")
    );
  });
  it("Should return 200 if task successfully deleted", async () => {
    TaskService.CheckTask = jest.fn().mockReturnValue({ error: null });
    TaskService.DeleteTask = jest.fn().mockResolvedValue({
      status: 200,
      message: "Task Successfully Deleted",
    });
    await deleteTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Task Successfully Deleted")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    TaskService.DeleteTask = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await deleteTask(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
