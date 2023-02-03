const { FailedResponse, SuccessResponse, AuthSuccessResponse } = require("../helpers/api.response");
const { GenerateToken, ComparePassword, GenerateRefreshToken } = require("../helpers/user.authentification");
const { UserValidator } = require("../validators/validator");
const { DecodedToken } = require("../helpers/token.decoder");
const AuthService = require("../../database/services/auth.service");
const status = require("http-status");

const register = async (req, res) => {
  try {
    const userValidate = UserValidator.validate(req.body);
    const userValidateError = userValidate.error;
    if (userValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, userValidateError.details));
    } else {
      const { name, email, password } = req.body;
      const userData = await AuthService.CheckUser({ email: email });
      if (userData) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, "The Email Account Already Exists"));
      } else {
        const data = { name: name, email: email, password: password };
        const user = await AuthService.CreateUser(data);
        res
          .status(status.OK)
          .send(SuccessResponse(status.OK, "User Successfully Registered", user));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await AuthService.CheckUser({ email: email });
    if (!userData) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "User Not Found"));
    } else {
      const token = GenerateToken(userData.id, userData.name);
      const validPassword = await ComparePassword(password, userData.password);
      if (!validPassword) {
        res
          .status(status.BAD_REQUEST)
          .send(FailedResponse(status.BAD_REQUEST, "Invalid Email or Password"));
      } else {
        await AuthService.SaveToken(token, userData.id);
        res
          .status(status.OK)
          .send(AuthSuccessResponse(status.OK, "User successfully logged in", token));
      }
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const logout = async (req, res) => {
  try {
    const token = req.body.access_token;
    const userId = DecodedToken(token);
    await AuthService.DeleteToken(userId);
    res
      .status(status.OK)
      .send(SuccessResponse(status.OK, "User successfully logged out"));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;
    const userId = DecodedToken(refreshToken);
    const user = await AuthService.FindUserById(userId);
    if (!user) {
      res
        .status(status.NOT_FOUND)
        .send(FailedResponse(status.NOT_FOUND, "User Not Found"));
    }
    const accessToken = GenerateRefreshToken(userId);
    await AuthService.SaveToken(accessToken, userId);
    res
      .status(status.OK)
      .send(AuthSuccessResponse(status.OK, "Access Token successfully Refreshed", accessToken));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
