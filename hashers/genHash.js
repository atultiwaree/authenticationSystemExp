const crypt = require("bcryptjs");
const genHash = (password) => {
  return crypt.hashSync(password, 3);
};

module.exports = genHash;
