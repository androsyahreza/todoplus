const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const { TaskValidator } = require("../validators/validator");
const TaskService = require("../../database/services/task.service");
const status = require("http-status");

const addTask = async (req, res) => {
  try {
    const taskValidate = TaskValidator.validate(req.body);
    const taskValidateError = taskValidate.error;
    if (taskValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, taskValidateError.details));
    } else {
      const goalId = req.params.goalId;
      const { title, date, time, link, note, is_finished } = req.body;
      const data = {
        title: title,
        date: date,
        time: time,
        link: link,
        note: note,
        is_finished: is_finished,
        goal_id: goalId,
      };
      const task = await TaskService.CreateTask(data);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Task Successfully Added", task));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const taskData = await TaskService.CheckTask(taskId);
    if (!taskData) {
      res
        .status(status.NOT_FOUND)
        .send(
          FailedResponse(
            status.NOT_FOUND,
            "Task Not Found, Please Add Task First"
          )
        );
    } else {
      const taskValidate = TaskValidator.validate(req.body);
      const taskValidateError = taskValidate.error;
      if (taskValidateError) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, taskValidateError.details));
      } else {
        const goalId = req.params.goalId;
        const { title, date, time, link, note, is_finished } = req.body;

        const data = {
          title: title,
          date: date,
          time: time,
          link: link,
          note: note,
          is_finished: is_finished,
          goal_id: goalId,
        };
        await TaskService.UpdateTask(taskId, data);
        res
          .status(status.OK)
          .send(SuccessResponse(status.OK, "Task Successfully Updated"));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const taskData = await TaskService.CheckTask(taskId);
    if (!taskData) {
      res
        .status(status.NOT_FOUND)
        .send(
          FailedResponse(
            status.NOT_FOUND,
            "Task Not Found, Please Add Task First"
          )
        );
    } else {
      await TaskService.DeleteTask(taskId);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Task Successfully Deleted"));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  addTask,
  updateTask,
  deleteTask,
};
