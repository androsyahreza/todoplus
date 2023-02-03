const { Tasks } = require("../models/index");

const CreateTask = async (data) => {
  return await Tasks.create(data, { returning: true });
};

const UpdateTask = async (task_id, data) => {
  return await Tasks.update(data, { where: { id: task_id } });
};

const DeleteTask = async (task_id) => {
  return await Tasks.destroy({ where: { id: task_id } });
};

const CheckTask = async (task_id) => {
  return await Tasks.findOne({ where: { id: task_id } });
};
module.exports = {
  CreateTask,
  UpdateTask,
  DeleteTask,
  CheckTask,
};
