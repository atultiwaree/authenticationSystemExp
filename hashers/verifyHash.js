const bcrypt = require("bcryptjs");

const verifyHash = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = verifyHash;
