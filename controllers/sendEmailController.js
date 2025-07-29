const Contact = require("../models/contact");
const sendEmail = require("../utils/sendEmail");

const handleSendEmail = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: "Please enter email or phone number." });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({ email, phone });
    await newContact.save();

    if (email) {
      // Send email to admin
      await sendEmail({
        to: "shivani.negi@aaveg.com",
        subject: "New Email Submission",
        text: `A new email has been submitted:\nEmail: ${email}`,
      });

      // Send email to user
      await sendEmail({
        to: email,
        subject: "Thank you for contacting us!",
        text: "Hi! Thank you for submitting your details. We'll get back to you shortly.",
      });

      return res.status(200).json({ message: "Email saved and emails sent to both user and admin." });
    }

    if (phone) {
      // Send email to admin only
      await sendEmail({
        to: "shivani.negi@aaveg.com",
        subject: "New Phone Submission",
        text: `A user with phone number ${phone} has reached out to you.`,
      });

      return res.status(200).json({ message: "Phone number saved and email sent to admin." });
    }

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { handleSendEmail };

