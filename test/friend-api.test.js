const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  followFriend,
  unfollowFriend,
  viewFriend,
} = require("../src/app/controllers/friend.controller");
const { FriendValidator } = require("../src/app/validators/validator");
const FriendService = require("../src/database/services/friend.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validators/validator", () => ({
  FriendValidator: {
    validate: jest.fn(),
  },
}));

jest.mock("../src/database/services/friend.service", () => ({
  AddFriend: jest.fn(),
  RemoveFriend: jest.fn(),
  ShowFriend: jest.fn(),
  CheckFriend: jest.fn(),
  FindRelationshipId: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
describe("Follow Friend endpoint", () => {
  const req = {
    body: {
      user_id: 1,
      following_id: 2,
    },
  };
  it("Should return 400 if friend validation fails", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await followFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 400 if user_id is same as following_id", async () => {
    const req = {
      body: {
        user_id: 1,
        following_id: 1,
      },
    };
    FriendValidator.validate = jest.fn().mockReturnValue({ error: null });
    await followFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "following_id should not be the same as user_id")
    );
  });
  it("Should return 400 if friend already exist", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({ error: null });
    FriendService.CheckFriend = jest.fn().mockResolvedValue(true);
    await followFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Not Allowed To Add Same Relation")
    );
  });
  it("Should return 200 if friend successfully followed", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({ error: null });
    FriendService.CheckFriend = jest.fn().mockResolvedValue(false);
    FriendService.AddFriend = jest.fn().mockResolvedValue({
      status: 200,
      message: "Friend Successfully Followed",
      data: "data",
    });
    await followFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Friend Successfully Followed", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    FriendService.AddFriend = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await followFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Unfollow Friend endpoint", () => {
  const req = {
    body: {
      user_id: 1,
      following_id: 2,
    },
  };
  it("Should return 400 if friend validation fails", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await unfollowFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 404 if relationship not found", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({ error: null });
    FriendService.FindRelationshipId = jest.fn().mockReturnValue(null);
    await unfollowFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "Relationship Not Found")
    );
  });
  it("Should return 200 if friend successfully unfollowed", async () => {
    FriendValidator.validate = jest.fn().mockReturnValue({ error: null });
    FriendService.FindRelationshipId = jest.fn().mockReturnValue({});
    FriendService.RemoveFriend = jest.fn();
    await unfollowFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "Friend Successfully Unfollowed")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    FriendService.RemoveFriend= jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await unfollowFriend(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("View Friend endpoint", () => {
  it("Should return 200 if success", async () => {
    const friends = [
      {
        user_id: 1,
        following_id: 2,
      },
    ];
    FriendService.ShowFriend = jest.fn().mockResolvedValue(friends);
    await viewFriend(null, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(SuccessResponse(200, null, friends));
  });
  it("Should return 500 if an error occurs", async () => {
    FriendService.ShowFriend = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewFriend(null, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
