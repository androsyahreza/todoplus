require("dotenv").config();
const { AuthResponse } = require("../helpers/api.response");
const AuthService = require("../../database/services/auth.service");
const status = require("http-status");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(status.UNAUTHORIZED)
        .send(AuthResponse(status.UNAUTHORIZED, "No Token Provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp < Date.now() / 1000) {
      return res
        .status(status.UNAUTHORIZED)
        .send(AuthResponse(status.UNAUTHORIZED, "Token Expired"));
    }
    const tokenExist = await AuthService.FindAccessToken(decoded.id);
    if (!tokenExist || tokenExist == null) {
      return res
        .status(status.UNAUTHORIZED)
        .send(AuthResponse(status.UNAUTHORIZED, "No Token Provided"));
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(status.UNAUTHORIZED)
        .send(AuthResponse(status.UNAUTHORIZED, "Token Expired"));
    }
    return res
      .status(status.UNAUTHORIZED)
      .send(AuthResponse(status.UNAUTHORIZED, "Token Tnvalid"));
  }
};

const isAuthorized = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const decodedId = decoded.id;
  const paramId = req.params.userId;
  if (decodedId == paramId) {
    next();
  } else {
    return res
      .status(status.UNAUTHORIZED)
      .send(
        AuthResponse(
          status.UNAUTHORIZED,
          "You are not authorized to perform this action"
        )
      );
  }
};

const hasPermission = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const decodedId = decoded.id;
  const userId = req.body.user_id;
  const ownerId = req.body.goal_owner;
  if (decodedId == userId || decodedId == ownerId) {
    next();
  } else {
    return res
      .status(status.UNAUTHORIZED)
      .send(
        AuthResponse(
          status.UNAUTHORIZED,
          "You are not authorized to perform this action"
        )
      );
  }
};

module.exports = {
  isAuthenticated,
  isAuthorized,
  hasPermission,
};
