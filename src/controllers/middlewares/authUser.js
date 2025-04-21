const jwt = require("jsonwebtoken");
require("dotenv").config();

function authUser(req, res, next) {
  try {
    let token = req.cookies.access_token
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userUuid = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authUser;