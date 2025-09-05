const { mongoose } = require("mongoose");


const BlogCategorySchema = new mongoose.Schema(
  {
    categoryName: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true,
    },
   
  },
  { timestamps: true  }
);
const BlogCategoryModel = mongoose.model("blog categories", BlogCategorySchema);

module.exports = BlogCategoryModel;
