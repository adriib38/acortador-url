const e = require("express");
const { User } = require("../models/authModels.js");
const { RefreshToken } = require("../models/authModels.js");
const { v4: uuidv4 } = require("uuid");

const findUserByUsername = async (username, attr) => {
  return await User.findOne({
    where: { username },
    attributes: attr,
  });
};

const createUser = async ({ username, password }, t) => {
  return await User.create({
    uuid: uuidv4(),
    username,
    password,
  }, { transaction: t })
};

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
  findUserByUsername,
  createUser,
  saveRefreshTokenInDb,
  existTokenInDb,
  removeTokenFromDb,
};