const express = require("express");
const authController = require("../controllers/authController");
const authUser = require("../controllers/middlewares/authUser.js");
const router = express.Router()

router
    .post("/signup", authController.signup)
    .post("/signin", authController.signin)
    .get("/signout", authController.signout)
    .get("/refresh-token", authController.getNewAccessTokenFromRefreshToken)
    .get("/get-user", authUser, authController.getUser)
    .delete("/delete-user", authUser, authController.deleteUser)    


module.exports = router;