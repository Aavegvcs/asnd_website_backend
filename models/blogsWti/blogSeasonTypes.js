const mongoose = require("mongoose");

const seasonTypeSchema = new mongoose.Schema(
  {
    seasonTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
        type:String,
        required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BlogSeasonTypesModel =  mongoose.model("blog seasontypes", seasonTypeSchema);

module.exports = BlogSeasonTypesModel;