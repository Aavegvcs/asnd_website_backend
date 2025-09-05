const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema(
  {
    categories: { type: String, required: true, trim: true }, // Blog category
    title: { type: String, required: true, trim: true }, // Blog title
    discription: {type:String, required:true, trim:true},
    slugs: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      trim: true,
    }, // URL slug
    tags: { type: String, required: true, trim: true }, // Blog tags
    metadesc: { type: String, required: true, trim: true }, // Meta description
    metatitle: { type: String, required: true, trim: true }, // Meta title
    metakeyword: { type: String, required: true, trim: true }, // Meta keywords
    canonicalurl: { type: String, required: true, trim: true }, // Canonical URL
    readingtime: { type: String, required: true, trim: true }, // Reading time
    paragraph: { type: String, required: true, trim: true }, // Blog content
    image: { type: String, required:true, trim: true }, // Featured Image (Banner)
    author: { type: String, required: true, trim: true }, // Author Name
    toc: { type: Array, required: true }, // Table of Contents
    isActive: { type: Boolean, default: true },
    schema: { type: Array, default: [] },
    table: { type: Array, default: [] },
  },
  { timestamps: true }
);
// const blogsSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     slugs: {
//       type: String,
//       required: true,
//       lowercase: true, // always stored in lowercase
//       unique: true,    // no duplicate slugs
//       trim: true,
//     },
//     categories: String,
//     discription: String,
//     tags: String,
//     metadesc: String,
//     metatitle: String,
//     metakeyword: String,
//     canonicalurl: String,
//     readingtime: String,
//     paragraph: String,
//     author: String,
//     toc: [String],
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

const blogsModel = mongoose.model("blogs", blogsSchema);

module.exports = blogsModel;
