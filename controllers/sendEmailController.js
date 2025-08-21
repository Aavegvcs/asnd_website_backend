const Contact = require("../models/contact");
const sendEmail = require("../utils/sendEmail");

const handleSendEmail = async (req, res) => {
  // Map 'contact' from request body to 'phone' for schema
  const { name, email, contact, company, message } = req.body;
  const phone = contact; // Align with schema field name

  // Validate required fields
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone number are required." });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, phone, company, message });
    await newContact.save();

    // Send email to admin
    await sendEmail({
      to: "jagdish.kuri@aaveg.com",
      subject: "New Contact Submission",
      text: `A new contact form has been submitted:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company || 'Not provided'}\nMessage: ${message || 'Not provided'}`,
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "Thank You for Your Query!",
      text: `Hi ${name},\n\nThank you for reaching out to us. We have received your query and will get back to you shortly.\n\nBest regards,\nASND Technology`,
    });

    return res.status(200).json({ message: "Details saved and emails sent to both user and admin." });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Something went wrong while processing your request." });
  }
};

module.exports = { handleSendEmail };