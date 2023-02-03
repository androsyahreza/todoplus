const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  GoalValidator,
  GoalMemberValidator,
} = require("../src/app/validators/validator");
const {
  addGoal,
  addGoalMember,
  updateGoal,
  deleteGoal,
} = require("../src/app/controllers/goal.controller");
const GoalService = require("../src/database/services/goal.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validators/validator", () => ({
  GoalValidator: {
    validate: jest.fn(),
  },
  GoalMemberValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/database/services/goal.service", () => ({
  CreateGoal: jest.fn(),
  UpdateGoal: jest.fn(),
  CreateGoalMember: jest.fn(),
  CheckGoal: jest.fn(),
  DeleteGoal: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
describe("Add Goal endpoint", () => {
  const req = {
    body: {
      title: "title",
      description: "description",
      goal_owner: 1,
    },
  };
  it("Should return 400 if goal validation fails", async () => {
    GoalValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if goal successfully added", async () => {
    GoalValidator.validate.mockReturnValue({ error: null });
    GoalService.CreateGoal.mockResolvedValue({
      status: 200,
      message: "Goal Successfully Added",
      data: "data",
    });
    await addGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Goal Successfully Added", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    GoalService.CreateGoal = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Add Goal Member endpoint", () => {
  const req = {
    body: {
      user_id: 1,
      goal_id: 2,
    },
  };
  it("Should return 400 if goal member validation fails", async () => {
    GoalMemberValidator.validate.mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addGoalMember(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if goal member successfully added", async () => {
    GoalMemberValidator.validate.mockReturnValue({ error: null });
    GoalService.CreateGoalMember.mockResolvedValue({
      status: 200,
      message: "Goal Member Successfully Added",
      data: "data",
    });
    await addGoalMember(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Goal Member Successfully Added", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    GoalService.CreateGoalMember = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addGoalMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Update Goal endpoint", () => {
  const req = {
    params: {
      goalId: 1,
    },
    body: {
      title: "title",
      description: "description",
      goal_owner: 1,
    },
  };
  it("Should return 404 if goal not found", async () => {
    GoalService.CheckGoal = jest.fn().mockReturnValue(null);
    await updateGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Goal Not Found, Please Add Goal First")
    );
  });
  it("Should return 400 if if goal validation fails", async () => {
    GoalService.CheckGoal = jest.fn().mockReturnValue({ error: null });
    GoalValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await updateGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if goal successfully updated", async () => {
    GoalService.CheckGoal = jest.fn().mockReturnValue({ error: null });
    GoalValidator.validate = jest.fn().mockReturnValue({ error: null });
    GoalService.UpdateGoal = jest.fn().mockResolvedValue({
      status: 200,
      message: "Goal Successfully Updated",
      data: "data",
    });
    await updateGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Goal Successfully Updated", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    GoalService.UpdateGoal = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await updateGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Delete Goal enpoint", () => {
  const req = {
    params: {
      goalId: 1,
    },
  };
  it("Should return 404 if goal not found", async () => {
    GoalService.CheckGoal = jest.fn().mockReturnValue(null);
    await deleteGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Goal Not Found, Please Add Goal First")
    );
  });
  it("Should return 200 if goal successfully deleted", async () => {
    GoalService.CheckGoal = jest.fn().mockReturnValue({ error: null });
    GoalService.DeleteGoal = jest.fn().mockResolvedValue({
      status: 200,
      message: "Goal Successfully Deleted",
    });
    await deleteGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Goal Successfully Deleted")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    GoalService.DeleteGoal = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await deleteGoal(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
