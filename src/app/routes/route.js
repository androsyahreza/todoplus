const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");
const goalController = require("../controllers/goal.controller");
const taskController = require("../controllers/task.controller");
const friendController = require("../controllers/friend.controller");
const notificationController = require("../controllers/notification.controller")
const { isAuthenticated, isAuthorized, hasPermission } = require("../middlewares/auth.middleware");

// Auth Route
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout); 
router.post("/refreshToken", authController.refreshToken); 

// Profile Route
router.post("/profile", isAuthenticated, hasPermission, profileController.addProfile);
router.get("/profile/:userId", isAuthenticated, isAuthorized, profileController.viewProfile);
router.put("/profile/:userId", isAuthenticated, isAuthorized, hasPermission, profileController.updateProfile);
router.get("/profile/:userId/goals", isAuthenticated, isAuthorized, profileController.viewProfileGoals);
router.get("/profile/:userId/goals/:goalId", isAuthenticated, isAuthorized, profileController.viewProfileGoalsDetails);
router.get("/profile/:userId/followings", isAuthenticated, isAuthorized, profileController.viewProfileFollowings);
router.get("/profile/:userId/followers", isAuthenticated, isAuthorized, profileController.viewProfileFollowers);
router.get("/profile/:userId/notifications", isAuthenticated, isAuthorized, notificationController.viewNotification);
router.post("/profile/:userId/notifications", isAuthenticated, isAuthorized, hasPermission, notificationController.readNotification);

// Goal Route
router.post("/goals", isAuthenticated, hasPermission, goalController.addGoal);
router.post("/goalsMember", isAuthenticated, goalController.addGoalMember);
router.put("/goals/:goalId", isAuthenticated, hasPermission, goalController.updateGoal);
router.delete("/goals/:goalId", isAuthenticated, goalController.deleteGoal);

// Task Route
router.post("/goals/:goalId/tasks", isAuthenticated, taskController.addTask);
router.put("/goals/:goalId/tasks/:taskId", isAuthenticated, taskController.updateTask);
router.delete("/goals/:goalId/tasks/:taskId", isAuthenticated, taskController.deleteTask);

// Friend Route
router.get("/friends", isAuthenticated, friendController.viewFriend);
router.post("/friends", isAuthenticated, hasPermission, friendController.followFriend);
router.delete("/friends", isAuthenticated, hasPermission, friendController.unfollowFriend);

module.exports = router;
