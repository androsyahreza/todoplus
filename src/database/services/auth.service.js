const { Users } = require("../models/index");

const CreateUser = async (data) => {
  return await Users.create(data, { returning: true });
};
const CheckUser = async (data) => {
  return await Users.findOne({ where: data });
};
const SaveToken = async (token, user_id) => {
  return await Users.update(
    { access_token: token },
    { where: { id: user_id } }
  );
};
const DeleteToken = async (user_id) => {
  return await Users.update({ access_token: null }, { where: { id: user_id } });
};
const FindUserById = async (user_id) => {
  return await Users.findOne({ where: { id: user_id } });
};
const FindAccessToken = async (user_id) => {
  const user = await Users.findOne({ where: { id: user_id }, logging: false });
  return user.access_token;
};
module.exports = {
  CreateUser,
  CheckUser,
  SaveToken,
  DeleteToken,
  FindUserById,
  FindAccessToken,
};
