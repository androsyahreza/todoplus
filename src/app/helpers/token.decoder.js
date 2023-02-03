require("dotenv").config();
const jwt = require("jsonwebtoken");

const DecodedToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

module.exports = {
  DecodedToken,
};
