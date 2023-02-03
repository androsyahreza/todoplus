require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const GenerateToken = (id, name) => {
  const payload = { id: id, name: name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};
const ComparePassword = (password, modelPassword) => {
  const validPassword = bcrypt.compare(password, modelPassword);
  return validPassword;
};
const GenerateRefreshToken = (id) => {
  const payload = { id: id };
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

module.exports = {
  GenerateToken,
  ComparePassword,
  GenerateRefreshToken,
};
