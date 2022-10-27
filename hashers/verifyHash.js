const bcrypt = require("bcryptjs");

const verifyHash = (password, hash) => {
  if (bcrypt.compare(password, hash)) {
    return true;
  } else {
    return false;
  }
};

module.exports = verifyHash;
