const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Url = require("../models/Url.js");
const sequelize = require("../services/db.js");
const { isPasswordCorrect } = require("../services/authService");
const { findUserByUsername, findUserByUuid, createUser } = require("../services/userService");
const { getEndpointsByUser } = require("../services/shortRoutesService.js");
const { saveRefreshTokenInDb, existTokenInDb, removeTokenFromDb } = require("../services/userService"); 
const { validateUsername, validatePassword } = require("../utils/validationService.js");

require("dotenv").config();

//Register new users
const signup = async (req, res) => {
  let user = req.body;

  const usernameValidation = validateUsername(user.username);
  if (!usernameValidation.valid) {
    return res.status(400).json({
      message: usernameValidation.message,
    });
  }

  const passwordValidation = validatePassword(user.password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      message: passwordValidation.message,
    });
  }

  const t = await sequelize.transaction();
  try {
    let userFound = await createUser(
     {
      username: user.username,
      password: user.password,
      transaction: t,
     } 
    );

    let accessToken = jwt.sign(
      {
        id: userFound.uuid,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      }
    );

    let refreshToken = jwt.sign(
      {
        id: userFound.uuid,
        jti: uuidv4(),
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      }
    );

    //Save refresh token in db
    const decoded = jwt.decode(refreshToken);
    await saveRefreshTokenInDb(userFound.uuid, decoded.jti, decoded.exp, t);

    await t.commit();
    return res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge:
          parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME.split("d")[0]) *
          24 *
          60 *
          60 *
          1000,
      })
      .json({
        message: "User created",
        user: user,
        access_token: accessToken,
      });
  } catch (e) {
    await t.rollback();
    if (e.parent?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }

    return res.status(500).json({ error: "Unknown error" });
  }
};

const signin = async (req, res) => {
  const user = req.body;

  if (!user.username || !user.password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const t = await sequelize.transaction();

  try {
    let userFound = await findUserByUsername(user.username);

    if (userFound === null) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    let validPassword = await isPasswordCorrect(
      user.password,
      userFound.dataValues.password
    );

    if (!validPassword) {
      await t.rollback();
      return res.status(401).json({ message: "Invalid password" });
    }

    let accessToken = jwt.sign(
      { id: userFound.dataValues.uuid },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      }
    );

    let refreshToken = jwt.sign(
      { 
        id: userFound.dataValues.uuid,
        jti: uuidv4(),
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      }
    );

    const decoded = jwt.decode(refreshToken);

    await saveRefreshTokenInDb(userFound.uuid, decoded.jti, decoded.exp, t);

    await t.commit();

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge:
          parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME.split("d")[0]) *
          24 *
          60 *
          60 *
          1000,
      })
      .json({
        message: "User logged in",
        user: userFound.username,
        access_token: accessToken,
      });

  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: e.message });
  }
};


const signout = async (req, res) => {
  let refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(403).json({ message: "No token provided" });
  }

  //Check if the refresh token is valid
  const isValid = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!isValid) {
    return res.status(403).json({ message: "Invalid token" });
  }

  // Delete refresh token from db
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const jti = decoded.jti;

  await removeTokenFromDb(jti);

  //Delete refresh token from cookies
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "User logged out successfully" });
};

const getUser = async (req, res) => {
  try {
    const userUuid = req.userUuid;
    if (!userUuid) {
      return res.status(403).json({ message: "No token provided" });
    }

    const user = await findUserByUuid(userUuid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const urls = await getEndpointsByUser(user.dataValues.uuid);

    return res.status(200).json({
      user: user.username,
      urls: urls,
    });
  }
  catch (e) {
    return res.status(500).json({ message: e.message });
  }
};


const getNewAccessTokenFromRefreshToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(403).json({ message: "No token provided" });
    }

    //Get jti for search in db
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const jti = decoded.jti;

    /**
     * If the token is valid but not in the database, the method will throw a "invalid token" error. (The user changed the password or deleted the account)
     * If the token is old or false, the method will throw a "invalid token" error.
     */
    const _existTokenInDb = await existTokenInDb(jti);
    const isValid = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (isValid && _existTokenInDb) {
      req.userUuid = isValid.id;
      let newAccessToken = jwt.sign(
        { id: req.userUuid },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
        }
      );

      return res.status(201).json({
        message: "New access token created",
        access_token: newAccessToken,
      });
    } else {
      //If token invalid return 403, NO 401 because with 401 the frontend send req tu refresh token, and that would cause an infinite loop
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Unknown error" });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  getNewAccessTokenFromRefreshToken,
  getUser,
};
