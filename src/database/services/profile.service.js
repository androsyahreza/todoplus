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
const { Profiles } = require("../models/index");

const CreateProfile = async (data) => {
  return await Profiles.create(data, { returning: true });
};

const ViewProfile = async (userId) => {
  return await Profiles.findOne({
    where: { user_id: userId },
    attributes: [
      "image",
      "username",
      "description",
      "phone",
      "date_of_birth",
      "gender",
      "user_id",
    ],
  });
};

const UpdateProfile = async (userId, data) => {
  return await Profiles.update(data, { where: { user_id: userId } });
};

const CheckProfile = async (userId) => {
  return await Profiles.findOne({ where: { user_id: userId } });
};

const ShowProfileGoals = async (id, title) => {
  const userId = id;
  const goalTitle = title;
  const sql = `
  SELECT u.id as "user_id", u."name", g.id as goal_id, g.title as goal_title, 
    COUNT(CASE WHEN t.is_finished = true THEN 1 END) as finished_tasks,
    COUNT(t.id) as total_tasks,
      (CASE 
        WHEN COUNT(CASE WHEN t.is_finished = true THEN 1 END) < COUNT(t.id) THEN 'On Process'
        WHEN COUNT(CASE WHEN t.is_finished = true THEN 1 END) = COUNT(t.id) THEN 'Done'
      END) as goal_status
  FROM "Users" u 
  JOIN "UserGoals" ug on u.id = ug.user_id 
  JOIN "Goals" g on ug.goal_id = g.id
  LEFT JOIN "Tasks" t  ON g.id = t.goal_id
  WHERE u.id = :userId AND g.title LIKE :goalTitle
  GROUP BY u.id, g.id, g.title;
  `;

  return await sequelize.query(sql, {
    replacements: { userId, goalTitle: `%${goalTitle}%` },
    type: QueryTypes.SELECT,
  });
};

const ProfileGoalsInfo = async (user_id, goal_id) => {
  const userId = user_id;
  const goalId = goal_id;
  const sql = `
  SELECT u.id as "user_id", u."name", g.id as goal_id, g.title as goal_title, 
  COUNT(CASE WHEN t.is_finished = true THEN 1 END) as finished_tasks,
  COUNT(t.id) as total_tasks,
    (CASE 
        WHEN COUNT(CASE WHEN t.is_finished = true THEN 1 END) < COUNT(t.id) THEN 'On Process'
        WHEN COUNT(CASE WHEN t.is_finished = true THEN 1 END) = COUNT(t.id) THEN 'Done'
    END) as goal_status
  FROM "Users" u 
  JOIN "UserGoals" ug on u.id = ug.user_id 
  JOIN "Goals" g on ug.goal_id = g.id
  LEFT JOIN "Tasks" t  ON g.id = t.goal_id
  WHERE u.id = :userId AND g.id = :goalId
  GROUP BY u.id, g.id, g.title;
  `;
  return await sequelize.query(sql, {
    replacements: { userId, goalId },
    type: QueryTypes.SELECT,
  });
};

const ProfileGoalsMembers = async (id) => {
  const goalId = id;
  const sql = `
  SELECT u."name" FROM "Users" u 
  JOIN "UserGoals" ug on u.id = ug.user_id 
  JOIN "Goals" g on ug.goal_id = g.id
  WHERE g.id = :goalId;
  `;
  return await sequelize.query(sql, {
    replacements: { goalId },
    type: QueryTypes.SELECT,
  });
};

const ProfileGoalsTasks = async (id) => {
  const goalId = id;
  const sql = `
  SELECT * FROM "Tasks" t 
  WHERE t.goal_id = :goalId;
  `;
  return await sequelize.query(sql, {
    replacements: { goalId },
    type: QueryTypes.SELECT,
  });
};

const ProfileFollowings = async (id) => {
  const userId = id;
  const sql = `
  SELECT u. id, u."name" , p.username, p.image  
  FROM "Relationships" r 
  JOIN "Users" u ON r.following_id = u.id
  JOIN "Profiles" p ON u.id = p.user_id 
  WHERE r.user_id = :userId
  ORDER BY u."name" ASC;
  `;
  return await sequelize.query(sql, {
    replacements: { userId },
    type: QueryTypes.SELECT,
  });
};

const ProfileFollowers = async (id) => {
  const followingId = id;
  const sql = `
  SELECT u."name" , p.username, p.image 
  FROM "Relationships" r 
  JOIN "Users" u on r.user_id  = u.id
  JOIN "Profiles" p on u.id = p.user_id 
  WHERE r.following_id = :followingId
  ORDER BY u."name" ASC;
  `;
  return await sequelize.query(sql, {
    replacements: { followingId },
    type: QueryTypes.SELECT,
  });
};

module.exports = {
  CreateProfile,
  ViewProfile,
  UpdateProfile,
  CheckProfile,
  ShowProfileGoals,
  ProfileGoalsInfo,
  ProfileGoalsMembers,
  ProfileGoalsTasks,
  ProfileFollowings,
  ProfileFollowers,
};
