const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const { FriendValidator } = require("../validators/validator");
const FriendService = require("../../database/services/friend.service");
const status = require("http-status");

const followFriend = async (req, res) => {
  try {
    const friendValidate = FriendValidator.validate(req.body);
    const friendValidateError = friendValidate.error;
    if (friendValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, friendValidateError.details));
    } else {
      const { user_id, following_id } = req.body;
      if (user_id === following_id) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, "following_id should not be the same as user_id"));
      } else {
        const friendExist = await FriendService.CheckFriend(user_id, following_id);
        if (friendExist) {
          res
            .status(status.BAD_REQUEST)
            .send(FailedResponse(status.BAD_REQUEST, "Not Allowed To Add Same Relation"));
        } else {
          const data = {
            user_id: user_id,
            following_id: following_id,
          };
          const friend = await FriendService.AddFriend(data);
          res
            .status(status.OK)
            .send(SuccessResponse(status.OK, "Friend Successfully Followed", friend));
        }
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const unfollowFriend = async (req, res) => {
  try {
    const friendValidate = FriendValidator.validate(req.body);
    const friendValidateError = friendValidate.error;
    if (friendValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, friendValidateError.details));
    } else {
      const { user_id, following_id } = req.body;
      const friendData = await FriendService.FindRelationshipId(user_id, following_id);
      if (!friendData) {
        res
          .status(status.NOT_FOUND)
          .send(FailedResponse(status.NOT_FOUND, "Relationship Not Found"));
      } else {
        await FriendService.RemoveFriend(friendData);
        res
          .status(status.OK)
          .send(SuccessResponse(status.OK, "Friend Successfully Unfollowed"));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewFriend = async (req, res) => {
  try {
    const friends = await FriendService.ShowFriend();
    res.status(status.OK).send(SuccessResponse(status.OK, null, friends));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  followFriend,
  unfollowFriend,
  viewFriend,
};
