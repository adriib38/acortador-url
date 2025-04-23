const express = require("express");
const router = express.Router();

const authUser = require("../controllers/middlewares/authUser.js");
const shortRoutesController = require("../controllers/shortRoutesController.js");

// short a URL
router.post("/c", authUser, shortRoutesController.shortRoute);
// redirect to the original URL
router.get("/:ext", shortRoutesController.redirectToLongUrl);

module.exports = router;