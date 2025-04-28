const { v4: uuidv4 } = require("uuid");
const User = require("../models/User.js");
const RefreshToken = require("../models/RefreshToken.js");

const findUserByUuid = async (userUuid, attr) => {
  return await User.findOne({
    where: { uuid: userUuid },
    attributes: attr,
  });
};

const findUserByUsername = async (username) => {
  return await User.findOne({
    where: { username: username },
    attributes: ["uuid", "username", "password"],
  });
}

const createUser = async ({username, password, transaction}) => {
  return await User.create({
    uuid: uuidv4(),
    username,
    password,
  }, { transaction: transaction });
}

const saveRefreshTokenInDb = async (userUuid, jti, exp, t) => {
  return await RefreshToken.create({
    uuid: uuidv4(),
    jti,
    userUuid,
    exp,
  }, { transaction: t });
}

const removeTokenFromDb = async (jti) => {
  return await RefreshToken.destroy({
    where: { jti },
  });
}

const existTokenInDb = async (jti) => {
  return await RefreshToken.findOne({
    where: { jti },
  });
}

module.exports = {
  findUserByUuid,
  findUserByUsername,
  createUser,
  saveRefreshTokenInDb,
  existTokenInDb,
  removeTokenFromDb,
};