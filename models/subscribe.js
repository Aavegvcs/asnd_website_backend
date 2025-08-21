const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "Email is required"] },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("ASNDEmailSubscribe", subscribeSchema);
