const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  email: String,
  phone: Number,
},{timestamps:true, versionKey:false});

module.exports = mongoose.model("Contact", contactSchema);
