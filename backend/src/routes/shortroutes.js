const express = require("express");
const router = express.Router();

const authUser = require("../controllers/middlewares/authUser.js");
const shortRoutesController = require("../controllers/shortRoutesController.js");

// short a URL
router
    // create a short URL
    .post("/c", authUser, shortRoutesController.shortRoute)
    // redirect to the original URL
    .get("/:ext", shortRoutesController.redirectToLongUrl)
    .delete("/:urlUuid", authUser, shortRoutesController.deleteShortUrl);


module.exports = router;