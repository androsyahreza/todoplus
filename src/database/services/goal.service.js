const { Goals, UserGoals } = require("../models/index");

const CreateGoal = async (data) => {
  return await Goals.create(data, { returning: true });
};

const UpdateGoal = async (goal_id, data) => {
  return await Goals.update(data, { where: { id: goal_id } });
};

const CreateGoalMember = async (data) => {
  return await UserGoals.create(data, { returning: true });
};

const CheckGoal = async (goal_id) => {
  return await Goals.findOne({
    where: { id: goal_id },
  });
};

const DeleteGoal = async (goal_id) => {
  return await Goals.destroy({ where: { id: goal_id } });
};
module.exports = {
  CreateGoal,
  UpdateGoal,
  CreateGoalMember,
  CheckGoal,
  DeleteGoal,
};
