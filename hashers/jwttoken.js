const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
function generateAccessToken(details) {
  return jwt.sign(details, process.env.SECRET_TOKEN, { expiresIn: "1800s" });
}
module.exports = generateAccessToken;
