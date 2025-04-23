const User = require("../models/authModels.js");
const { v4: uuidv4 } = require("uuid");

const findUserByUsername = async (username, attr) => {
  return await User.findOne({
    where: { username },
    attributes: attr,
  });
};

const createUser = async ({ username, password }) => {
  return await User.create({
    uuid: uuidv4(),
    username,
    password,
  });
};

module.exports = {
  findUserByUsername,
  createUser,
};