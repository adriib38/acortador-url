const express = require("express");
const router = express.Router();

const authUser = require("../controllers/middlewares/authUser.js");
const ShortRoutesController = require("../controllers/ShortRoutesController");

// short a URL
router.post("/c", authUser, ShortRoutesController.shortRoute);
// redirect to the original URL
router.get("/:ext", ShortRoutesController.redirectToUrl);

module.exports = router;