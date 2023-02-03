const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  addProfile,
  viewProfile,
  updateProfile,
  viewProfileGoals,
  viewProfileGoalsDetails,
  viewProfileFollowings,
  viewProfileFollowers,
} = require("../src/app/controllers/profile.controller");
const { ProfileValidator } = require("../src/app/validators/validator");
const ProfileService = require("../src/database/services/profile.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validators/validator", () => ({
  ProfileValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/database/services/profile.service", () => ({
  CreateProfile: jest.fn(),
  ViewProfile: jest.fn(),
  UpdateProfile: jest.fn(),
  CheckProfile: jest.fn(),
  ShowProfileGoals: jest.fn(),
  ProfileGoalsInfo: jest.fn(),
  ProfileGoalsMembers: jest.fn(),
  ProfileGoalsTasks: jest.fn(),
  ProfileFollowings: jest.fn(),
  ProfileFollowers: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
const req = {
  params: {
    userId: 1,
  },
};
describe("Add Profile endpoint", () => {
  const req = {
    body: {
      image: "image",
      username: "username",
      description: "description",
      phone: "phone",
      date_of_birth: "date_of_birth",
      gender: "gender",
      user_id: "user_id",
    },
  };
  it("Should return 400 if profile validation fails", async () => {
    ProfileValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if profile successfully added", async () => {
    ProfileValidator.validate = jest.fn().mockReturnValue({ error: null });
    ProfileService.CreateProfile = jest.fn().mockResolvedValue({
      status: 200,
      message: "Profile Successfully Added",
      data: "profile",
    });
    await addProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Profile Successfully Added", "profile")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.CreateProfile = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Profile endpoint", () => {
  const req = {
    params: {
      userId: 1,
    },
  };
  it("Should return 404 if profile not found", async () => {
    ProfileService.ViewProfile = jest.fn().mockReturnValue(null);
    await viewProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Profile Not Found, Please Create Profile First")
    );
  });
  it("Should return 200 if profile successfully viewed", async () => {
    ProfileService.ViewProfile = jest.fn().mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.ViewProfile = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Update Profile endpoint", () => {
  const req = {
    params: {
      userId: 1,
    },
    body: {
      image: "image",
      username: "username",
      description: "description",
      phone: "phone",
      date_of_birth: "date_of_birth",
      gender: "gender",
      user_id: "user_id",
    },
  };
  it("Should return 404 if profile not found", async () => {
    ProfileService.CheckProfile = jest.fn().mockReturnValue(null);
    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Profile Not Found, Please Create Profile First")
    );
  });
  it("Should return 400 if profile validation fails", async () => {
    ProfileService.CheckProfile = jest.fn().mockReturnValue({error: null});
    ProfileValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if profile successfully udpated", async () => {
    ProfileService.CheckProfile = jest.fn().mockReturnValue({error: null});
    ProfileValidator.validate = jest.fn().mockReturnValue({ error: null });
    ProfileService.UpdateProfile = jest.fn().mockResolvedValue({
      status: 200,
      message: "Profile Successfully Updated",
      data: "data",
    });
    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Profile Successfully Updated", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.UpdateProfile = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Profile Goals endpoint", () => {
  const req = {
    params: {
      userId: 1,
    },
    query: {
      goal: "goal",
    },
  };
  it("Should return 200 if profle goals successfully viewed", async () => {
    ProfileService.ShowProfileGoals = jest.fn().mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewProfileGoals(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.ShowProfileGoals = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewProfileGoals(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Profile Goals Details endpoint", () => {
  const req = {
    params: {
      userId: 1,
      goalid: 1,
    },
  };
  it("Should return 200 if profile goals successfully viewed", async () => {
    ProfileService.ProfileGoalsInfo = jest.fn().mockResolvedValue({});
    ProfileService.ProfileGoalsMembers = jest.fn().mockResolvedValue({});
    ProfileService.ProfileGoalsTasks = jest.fn().mockResolvedValue({});
    await viewProfileGoalsDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null));
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.ProfileGoalsInfo = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    ProfileService.ProfileGoalsMembers = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    ProfileService.ProfileGoalsTasks = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewProfileGoalsDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Profile Following endpoint", () => {
  it("Should return 200 if profile following successfully viewed", async () => {
    ProfileService.ProfileFollowings = jest.fn().mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewProfileFollowings(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.ProfileFollowings = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewProfileFollowings(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Profile Followers endpoint", () => {
  it("Should return 200 if profile followers successfully viewed", async () => {
    ProfileService.ProfileFollowers = jest.fn().mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewProfileFollowers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    ProfileService.ProfileFollowers = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewProfileFollowers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
