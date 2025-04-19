const User = require("../Models/AuthModels.js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

require("dotenv").config();

//Register new users
const signup = async (req, res) => {
  //TODO: Validate username and password (regex)
  let user = req.body;

  if (!user.username || !user.password) {
    return res.status(400).json({
      message: "Username and password required.",
    });
  }

  try {
    let userFound = await User.create({
      uuid: uuidv4(),
      username: user.username,
      password: user.password,
    });

    let token = jwt.sign({ id: userFound.uuid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        message: "User created",
        user: user,
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

  if (!user.username || !user.password) {
    return res.status(400).json({
      message: "Username and password required.",
    });
  }
  //TODO: Validate username and password (regex)

  try {
    let userFound = await User.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound === null) {
      return res.status(404).json({ message: "User not found" });
    }

    let validPassword = await validatePassword(
      user.password,
      userFound.dataValues.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
        let token = jwt.sign({ id: userFound.dataValues.uuid }, process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

      return res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        })
        .json({
          message: "User logged in",
          user: userFound.username,
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

const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  signup,
  signin,
  signout,
};
