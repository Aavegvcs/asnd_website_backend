const Subscribe = require("../models/subscribe");

const handleSubscribeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please enter your email address" });
  }

  try {
    const newEmail = new Subscribe({ email });
    await newEmail.save();

    return res.status(200).json({
      message: "Your email has been successfully subscribed for the latest updates from ASND"
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      error: "Something went wrong while processing your request."
    });
  }
};

module.exports = { handleSubscribeEmail };
