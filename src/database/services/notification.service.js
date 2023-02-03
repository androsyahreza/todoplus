require("dotenv").config();
const { QueryTypes } = require("sequelize");
const moment = require("moment");
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

const TaskIndex = async () => {
  const date = moment()
    .utc()
    .add(7, "h")
    .add(30, "m")
    .toISOString()
    .slice(0, 10);
  const time = moment()
    .utc()
    .add(7, "h")
    .add(30, "m")
    .toISOString()
    .slice(11, 19);
  const taskDate = date;
  const taskTime = time;
  const sql = `
  SELECT g.goal_owner user_id, t.title, t."date", t."time"
  FROM "Tasks" t  JOIN "Goals" g ON t.goal_id = g.id 
  WHERE is_finished = false AND t."date" = :taskDate AND t."time" = :taskTime
  `;
  return await sequelize.query(sql, {
    replacements: { taskDate, taskTime },
    type: QueryTypes.SELECT,
    logging: false,
  });
};

const SendNotification = async (task_title, user_id) => {
  const taskTitle = task_title;
  const userId = user_id;
  const sql = `
  INSERT INTO "Notifications" 
  (title, "content", user_id, "createdAt", "updatedAt")
  VALUES ('You have an unfinished Task!', :taskTitle , 
  :userId, current_timestamp, current_timestamp);
  `;
  return await sequelize.query(sql, {
    replacements: { taskTitle, userId },
    type: QueryTypes.INSERT,
  });
};

const ViewNotification = async (user_id) => {
  const userId = user_id;
  const sql = `
  SELECT  * FROM "Notifications" n 
  WHERE user_id = :userId;
  `;
  return await sequelize.query(sql, {
    replacements: { userId },
    type: QueryTypes.SELECT,
  });
};

const ReadNotification = async (notification_id, user_id) => {
  const notificationId = notification_id;
  const userId = user_id;
  const sql = `
  INSERT INTO "NotificationReads" 
  (is_read, user_id, notification_id, "createdAt", "updatedAt")
  values ('true', :userId, :notificationId, current_timestamp, current_timestamp);
  `;
  return await sequelize.query(sql, {
    replacements: { notificationId, userId },
    type: QueryTypes.INSERT,
  });
};

module.exports = {
  TaskIndex,
  SendNotification,
  ViewNotification,
  ReadNotification,
};
