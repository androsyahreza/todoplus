const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const { GoalValidator, GoalMemberValidator } = require("../validators/validator");
const GoalService = require("../../database/services/goal.service");
const status = require("http-status");

const addGoal = async (req, res) => {
  try {
    const goalValidate = GoalValidator.validate(req.body);
    const goalValidateError = goalValidate.error;
    if (goalValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, goalValidateError.details));
    } else {
      const { title, description, goal_owner } = req.body;
      const data = {
        title: title,
        description: description,
        goal_owner: goal_owner,
      };
      const goal = await GoalService.CreateGoal(data);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Goal Successfully Added", goal));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const addGoalMember = async (req, res) => {
  try {
    const goalMemberValidate = GoalMemberValidator.validate(req.body);
    const goalMemberValidateError = goalMemberValidate.error;
    if (goalMemberValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, goalMemberValidateError.details));
    } else {
      const { user_id, goal_id } = req.body;
      const data = {
        user_id: user_id,
        goal_id: goal_id,
      };
      const goalMember = await GoalService.CreateGoalMember(data);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Goal Member Successfully Added", goalMember));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const goalData = await GoalService.CheckGoal(goalId);
    if (!goalData) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "Goal Not Found, Please Add Goal First"));
    } else {
      const goalValidate = GoalValidator.validate(req.body);
      const goalValidateError = goalValidate.error;
      if (goalValidateError) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, goalValidateError.details));
      } else {
        const { title, description, goal_owner } = req.body;
        const data = {
          title: title,
          description: description,
          goal_owner: goal_owner,
        };
        await GoalService.UpdateGoal(goalId, data);
        res
          .status(status.OK)
          .send(SuccessResponse(status.OK, "Goal Successfully Updated"));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const goalData = await GoalService.CheckGoal(goalId);
    if (!goalData) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "Goal Not Found"));
    } else {
      await GoalService.DeleteGoal(goalId);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Goal Successfully Deleted"));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  addGoal,
  addGoalMember,
  updateGoal,
  deleteGoal,
};
