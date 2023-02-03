const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const { ProfileValidator } = require("../validators/validator");
const ProfileService = require("../../database/services/profile.service");
const status = require("http-status");

const addProfile = async (req, res) => {
  try {
    const profileValidate = ProfileValidator.validate(req.body);
    const profileValidateError = profileValidate.error;
    if (profileValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, profileValidateError.details));
    } else {
      const {
        image,
        username,
        description,
        phone,
        date_of_birth,
        gender,
        user_id,
      } = req.body;
      const data = {
        image: image,
        username: username,
        description: description,
        phone: phone,
        date_of_birth: date_of_birth,
        gender: gender,
        user_id: user_id,
      };
      const profile = await ProfileService.CreateProfile(data);
      res
        .status(status.OK)
        .send(SuccessResponse(status.OK, "Profile Successfully Added", profile));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await ProfileService.ViewProfile(userId);
    if (!profile) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "Profile Not Found, Please Create Profile First"));
    } else {
      res.status(status.OK).send(SuccessResponse(status.OK, null, profile));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profileData = await ProfileService.CheckProfile(userId);
    if (!profileData) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "Profile Not Found, Please Create Profile First"));
    } else {
      const profileValidate = ProfileValidator.validate(req.body);
      const profileValidateError = profileValidate.error;
      if (profileValidateError) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, profileValidateError.details));
      } else {
        const {
          image,
          username,
          description,
          phone,
          date_of_birth,
          gender,
          user_id,
        } = req.body;
        const data = {
          image: image,
          username: username,
          description: description,
          phone: phone,
          date_of_birth: date_of_birth,
          gender: gender,
          user_id: user_id,
        };
        await ProfileService.UpdateProfile(userId, data);
        res
          .status(status.OK)
          .send(SuccessResponse(status.OK, "Profile Successfully Updated"));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewProfileGoals = async (req, res) => {
  try {
    const userId = req.params.userId;
    const goalTitle = req.query.goal;
    const goal = await ProfileService.ShowProfileGoals(userId, goalTitle);
    res.status(status.OK).send(SuccessResponse(status.OK, null, goal));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewProfileGoalsDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const goalId = req.params.goalId;
    const goal_info = await ProfileService.ProfileGoalsInfo(userId, goalId);
    const goal_member = await ProfileService.ProfileGoalsMembers(goalId);
    const goal_task = await ProfileService.ProfileGoalsTasks(goalId);
    const data = {
      Goals: { goal_info, goal_member },
      Tasks: { goal_task },
    };
    res.status(status.OK).send(SuccessResponse(status.OK, null, data));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewProfileFollowings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const followings = await ProfileService.ProfileFollowings(userId);
    res.status(status.OK).send(SuccessResponse(status.OK, null, followings));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewProfileFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const followers = await ProfileService.ProfileFollowers(userId);
    res.status(status.OK).send(SuccessResponse(status.OK, null, followers));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  addProfile,
  viewProfile,
  updateProfile,
  viewProfileGoals,
  viewProfileGoalsDetails,
  viewProfileFollowings,
  viewProfileFollowers,
};
