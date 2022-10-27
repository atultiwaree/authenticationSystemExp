const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const stringToken = String(process.env.SECRET_TOKEN);
    jwt.verify(token, stringToken, (err, data) => {
      if (err) return res.status(403);

      res.json({ data: data }).status(200);

      next();
    });
  } else {
    res.send("Empty token").status(400);
  }
};

module.exports = verifyToken;
