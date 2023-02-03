const {
  sendNotifications,
} = require("./app/controllers/notification.controller");
const router = require("./app/routes/route");
const bodyParser = require("body-parser");
const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/", router);

cron.schedule("* * * * * *", () => {
  sendNotifications();
});

app.get("/api/ping", (req, res) => {
  res.json("Hello World! 👋");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
