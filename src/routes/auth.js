const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router()

router
    .post("/signup", authController.signup)
    .post("/signin", authController.signin)
    .get("/signout", authController.signout)


module.exports = router;