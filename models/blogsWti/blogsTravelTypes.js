const mongoose = require("mongoose");

const travelTypeSchema = new mongoose.Schema(
  {
    travelTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BlogTravelTypesModel =  mongoose.model("blog traveltypes", travelTypeSchema);

module.exports = BlogTravelTypesModel;