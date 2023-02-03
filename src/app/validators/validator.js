const Joi = require("joi").extend(require("@joi/date"));

const UserValidator = Joi.object().keys({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(10).email().required(),
  password: Joi.string().min(6).required(),
});

const ProfileValidator = Joi.object().keys({
  image: Joi.string().allow("").optional(),
  username: Joi.string().min(3).max(30).required(),
  description: Joi.string().allow("").optional(),
  phone: Joi.string()
    .min(10)
    .pattern(/^[0-9]+$/),
  date_of_birth: Joi.date().format("YYYY-MM-DD").utc(),
  gender: Joi.string().valid("male", "female"),
  user_id: Joi.number().required(),
});

const GoalValidator = Joi.object().keys({
  title: Joi.string().min(2).required(),
  description: Joi.string().allow("").optional(),
  goal_owner: Joi.number().required(),
});

const GoalMemberValidator = Joi.object().keys({
  user_id: Joi.number().required(),
  goal_id: Joi.number().required(),
});

const TaskValidator = Joi.object().keys({
  title: Joi.string().min(2).required(),
  date: Joi.date().format("YYYY-MM-DD").utc().required(),
  time: Joi.string()
    .regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
    .required(),
  link: Joi.string().allow("").optional(),
  note: Joi.string().allow("").optional(),
  is_finished: Joi.boolean().required(),
});

const FriendValidator = Joi.object().keys({
  user_id: Joi.number().required(),
  following_id: Joi.number().required(),
});

const NotificationValidator = Joi.object().keys({
  notification_id: Joi.number().required(),
  user_id: Joi.number().required(),
});

module.exports = {
  UserValidator,
  ProfileValidator,
  GoalValidator,
  GoalMemberValidator,
  TaskValidator,
  FriendValidator,
  NotificationValidator,
};
