const mongoose = require("mongoose");


const AuthorModelschema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    isActive: {
        type: String,
        default: true
    }
  },
  { timestamps: true }
);


const authorModel =  mongoose.model("blog authors", AuthorModelschema);
module.exports = authorModel;