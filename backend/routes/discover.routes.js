const express = require("express");
const discoverController = require("../controllers/discover.controller.js");

const router = express.Router();

router.get("/feed", discoverController.getFeed);
router.post("/swipe", discoverController.recordSwipe);
router.get("/matches", discoverController.getMatches);

module.exports = router;

