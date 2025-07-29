const express = require("express");
const router = express.Router();
const { handleSendEmail } = require("../controllers/sendEmailController");

router.post("/api/send-email", handleSendEmail);

module.exports = router;
