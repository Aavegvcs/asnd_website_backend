const express = require("express");
const { handleSubscribeEmail } = require("../controllers/subscribeController");

const router = express.Router();

router.post("/subscribe", handleSubscribeEmail);

module.exports = router;
