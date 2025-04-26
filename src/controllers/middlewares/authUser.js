const jwt = require("jsonwebtoken");
require("dotenv").config();

function authUser(req, res, next) {
  try {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const accessToken = bearerToken.split(" ")[1];
    req.userUuid = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET).id;
    if (!req.userUuid) {
      return res.status(403).json({ message: "Invalid token" });
    }

    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }  
}

module.exports = authUser;