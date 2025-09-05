const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryImageUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BlogCategoryModel =  mongoose.model("blog categories", blogCategorySchema);

module.exports = BlogCategoryModel;



