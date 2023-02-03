require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);
const { QueryTypes } = require("sequelize");
const { Relationships } = require("../models/index");

const AddFriend = async (data) => {
  return await Relationships.create(data, { returning: true });
};

const RemoveFriend = async (data) => {
  return await Relationships.destroy({ where: data });
};

const ShowFriend = async () => {
  const sql = `
  SELECT u.id as user_id, u."name", p.username, p.image 
  FROM "Users" u
  JOIN "Profiles" p ON u.id = p.user_id 
  ORDER BY u."name" ASC ;
  `;
  return await sequelize.query(sql, {
    type: QueryTypes.SELECT,
  });
};

const CheckFriend = async (user_id, following_id) => {
  const userId = user_id;
  const followingId = following_id;
  return await Relationships.findOne({
    where: {
      user_id: userId,
      following_id: followingId,
    },
  });
};

const FindRelationshipId = async (user_id, following_id) => {
  const userId = user_id;
  const followingId = following_id;
  const sql = `
  SELECT r.id FROM "Relationships" r 
  WHERE r.user_id = :userId and r.following_id = :followingId;
  `;
  return await sequelize.query(sql, {
    replacements: { userId, followingId },
    type: QueryTypes.SELECT,
  });
};

module.exports = {
  AddFriend,
  RemoveFriend,
  ShowFriend,
  CheckFriend,
  FindRelationshipId,
};
