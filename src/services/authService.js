const bcrypt = require("bcrypt");

//Compare the password with the hash
const isPasswordCorrect = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  isPasswordCorrect,
};