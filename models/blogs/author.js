const mongoose = require("mongoose");


const authorModelSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    bio: {
      type:String
    }, 
    isActive: {type: Boolean, default: true}
  },
  { timestamps: true }
);


const authorModel =  mongoose.model("blog authors", authorModelSchema);

module.exports = authorModel;
