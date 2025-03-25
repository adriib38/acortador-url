const { User } = require("../Models/AuthModels.js")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

//Register new users
const signup = async (req, res) => {
    let user = (req.body);

    try { 
        const _user = await User.create({
            uuid: uuidv4(),
            username: user.username,
            password: user.password,
        });
    
    } catch(e) {
        if (e.parent.code === "ER_DUP_ENTRY") {
            return res
                .status(409)
                .json({ error: "Username already exists" });
        }

        return res
            .status(500)
            .json({ error: "Unknown error" });
    }

    let token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
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
} 

module.exports = {
    signup
}