const User = require("../Models/AuthModels.js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Url } = require("../Models/models.js");
const { validateUsername, validatePassword } = require("../services/validationService");

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

  try {
    let userFound = await User.create({
      uuid: uuidv4(),
      username: user.username,
      password: user.password,
    });

    let accessToken = jwt.sign(
      { id: userFound.uuid },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      }
    );

    let refreshToken = jwt.sign(
      { id: userFound.uuid },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      }
    );

    return res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        message: "User created",
        user: user,
        access_token: accessToken,
      });
  } catch (e) {
    if (e.parent?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }

    return res.status(500).json({ error: "Unknown error" });
  }
};

const signin = async (req, res) => {
  const user = req.body;

  // In signin the validation is not necessary only required
  if (!user.username || !user.password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    let userFound = await User.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound === null) {
      return res.status(404).json({ message: "User not found" });
    }

    let validPassword = await isPasswordCorrect(
      user.password,
      userFound.dataValues.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      let accessToken = jwt.sign(
        { id: userFound.dataValues.uuid },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
        }
      );

      let refreshToken = jwt.sign(
        { id: userFound.dataValues.uuid },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        }
      );

      return res
        .status(200)
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        })
        .json({
          message: "User logged in",
          user: userFound.username,
          access_token: accessToken,
        });
    }
  } catch (e) {
    return res.status(500).json({ message: "Unknown error" });
  }
};

const signout = async (req, res) => {
  res.cookie("access_token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const refreshToken = async (req, res) => {
  let refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(403).json({ message: "No token provided" });
  }

  const isValid = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  if (isValid) {
    req.userUuid = isValid.id; //Get user uuid from token
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
};

const getUser = async (req, res) => {
  try {
    const userFound = await User.findOne({
      where: {
        uuid: req.userUuid,
      },
      attributes: ["username", "createdAt", "updatedAt"],
    });

    const userEndpointsFound = await Url.findAll({
      where: {
        user: req.userUuid,
      },
      attributes: ["uuid", "long", "short", "createdAt", "updatedAt"],
    });

    if (userFound === null) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({
        user: {
          username: userFound.username,
          createdAt: userFound.createdAt,
          updatedAt: userFound.updatedAt,
          endpoints: userEndpointsFound.length,
        },
        endpoints: userEndpointsFound,
      });
    }
  } catch (e) {
    return res.status(500).json({ message: "Unknown error" });
  }
};

const isPasswordCorrect = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  signup,
  signin,
  signout,
  refreshToken,
  getUser,
};
