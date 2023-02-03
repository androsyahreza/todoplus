const {
  FailedResponse,
  SuccessResponse,
  AuthSuccessResponse,
} = require("../src/app/helpers/api.response");
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../src/app/controllers/auth.controller");
const Authentification = require("../src/app/helpers/user.authentification");
const { UserValidator } = require("../src/app/validators/validator");
const Decoder = require("../src/app/helpers/token.decoder");
const AuthService = require("../src/database/services/auth.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
  AuthSuccessResponse: jest.fn(),
}));

jest.mock("../src/app/helpers/user.authentification", () => ({
  GenerateToken: jest.fn(),
  ComparePassword: jest.fn(),
  GenerateRefreshToken: jest.fn(),
}));

jest.mock("../src/app/validators/validator", () => ({
  UserValidator: {
    validate: jest.fn(),
  },
}));

jest.mock("../src/app/helpers/token.decoder", () => ({
  DecodedToken: jest.fn(),
}));

jest.mock("../src/database/services/auth.service", () => ({
  CheckUser: jest.fn(),
  CreateUser: jest.fn(),
  SaveToken: jest.fn(),
  DeleteToken: jest.fn(),
  FindUserById: jest.fn(),
}));
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
describe("Register endpoint", () => {
  const req = {
    body: {
      name: "Sample User",
      email: "user@gmail.com",
      password: "password",
    },
  };
  it("Should return 400 if user validation fails", async () => {
    const req = {
      body: {
        name: "test",
        email: "test@notmail.com",
        password: "password",
      },
    };
    UserValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if user successfully registered", async () => {
    UserValidator.validate = jest.fn().mockReturnValue({ error: null });
    AuthService.CheckUser = jest.fn().mockReturnValue(null);
    AuthService.CreateUser = jest.fn().mockReturnValue({
      id: 1,
      name: "Sample User",
      email: "user@gmail.com",
    });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "User Successfully Registered", {
        id: 1,
        name: "Sample User",
        email: "user@gmail.com",
      })
    );
  });
  it("Should return 400 if user already exist", async () => {
    UserValidator.validate = jest.fn().mockReturnValue({ error: null });
    AuthService.CheckUser = jest.fn().mockReturnValue({ id: 1 });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "The The Email Account Already Exists")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    UserValidator.validate = jest.fn().mockReturnValue({ error: null });
    AuthService.CheckUser = jest.fn().mockReturnValue(null);
    AuthService.CreateUser = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Login endpoint", () => {
  const req = {
    body: {
      email: "existing@gmail.com",
      password: "invalid",
    },
  };
  it("Should return 404 if user not found", async () => {
    const req = {
      body: {
        email: "notexist@gmail.com",
        password: "password",
      },
    };
    AuthService.CheckUser = jest.fn().mockReturnValue(null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "User Not Found")
    );
  });
  it("Should return 400 if invalid email or password", async () => {
    const userData = {
      email: "existing@gmail.com",
    };
    AuthService.CheckUser = jest.fn().mockReturnValue({ error: null });
    Authentification.ComparePassword = jest
      .fn()
      .mockImplementation((password, hashedPassword) => {
        return false;
      });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(400, "Invalid Email or Password")
    );
  });
  it("Should return 200 if user successfully logged in", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const userData = {
      id: 1,
      name: "User",
      email: "user@gmail.com",
    };
    AuthService.CheckUser = jest.fn().mockReturnValue(userData);
    Authentification.GenerateToken = jest.fn().mockReturnValue(token);
    Authentification.ComparePassword.mockImplementation(
      (password, hashedPassword) => {
        return true;
      }
    );
    AuthService.SaveToken = jest.fn().mockResolvedValue({
      status: 200,
      message: "User successfully logged in",
      data: token,
    });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      AuthSuccessResponse(200, "User successfully logged in", token)
    );
  });
  it("Should return 500 if an error occurs", async () => {
    AuthService.CheckUser = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Logout endpoint", () => {
  const req = { body: { access_token: "mock_token" } };
  it("Should return 200 if user successfully logged out", async () => {
    Decoder.DecodedToken = jest.fn().mockReturnValue("mock_user_id");
    AuthService.DeleteToken = jest.fn().mockResolvedValue(undefined);
    await logout(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(200, "User successfully logged out")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    AuthService.DeleteToken = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await logout(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
describe("Refresh Token endpoint", () => {
  const req = {
    body: {
      refresh_token: "refresh_token",
    },
  };
  it("Should return 404 if user not found", async () => {
    Decoder.DecodedToken = jest.fn().mockReturnValue(1);
    AuthService.FindUserById = jest.fn().mockResolvedValue(null);
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      FailedResponse(404, "User Not Found")
    );
  });
  it("Should return 200 if refresh token successfully generated", async () => {
    Decoder.DecodedToken = jest.fn().mockReturnValue(1);
    AuthService.FindUserById = jest.fn().mockResolvedValue({});
    Authentification.GenerateRefreshToken = jest
      .fn()
      .mockReturnValue("new_access_token");
    AuthService.SaveToken.mockResolvedValue();
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      SuccessResponse(
        200,
        "Access Token successfully Refreshed",
        "new_access_token"
      )
    );
  });
  it("Should return 500 if an error occurs", async () => {
    AuthService.SaveToken = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
