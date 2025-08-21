const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"] },
  phone: { type: Number, required: [true, "Phone number is required"] },
  company: { type: String },
  message: { type: String },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Contact", contactSchema);