const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
      if (err)
        return res.status(403).json({ success: false, res: "Invalid Token!" });

      res.locals.userId = data.id;

      next();
    });
  } else {
    return res.json({ success: false, res: "No token found!" }).status(400);
  }
};

module.exports = verifyToken;
