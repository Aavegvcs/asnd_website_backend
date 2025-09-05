const authorModel = require("../models/blogs/author");

const time = require("../utils/timestamp");

// exports.createAuthor = async (req, res) => {
  
//   try {
       
//       const AuthorModel = authorModel;
//       const authorName  = (req.body.authorName).toLowerCase();
  
//       // Check if the authorName is provided
//       if (!authorName || ! req.body.bio) {
//         return res.status(400).json({ error: "Author name and bio is required" });
//       }
  
//       // Create a new author
//       const newAuthor = new AuthorModel({
//         authorName: authorName,
//         bio: req.body.bio
//       });
  
//       await newAuthor.save();
  
//       res.status(201).json({
//         message: "Author created successfully",
//       });
//     } catch (err) {
//       console.log(time.tds(), req.ip, ` - /api/authors/create - ${err.message}`);
//       res.status(500).json({ error: err.message });
//     }
//   };
  exports.createAuthor = async (req, res) => {
  try {
    const AuthorModel = authorModel;
    const authorName = (req.body.authorName || "").toLowerCase();
    const bio = req.body.bio;

    // Validate input
    if (!authorName || !bio) {
      return res.status(400).json({ error: "Author name and bio are required" });
    }

    // Check for existing author
    const existingAuthor = await AuthorModel.findOne({ authorName });
    if (existingAuthor) {
      return res.status(409).json({ error: "Author already exists" }); // 409 Conflict
    }

    // Create a new author
    const newAuthor = new AuthorModel({
      authorName,
      bio,
    });

    await newAuthor.save();

    res.status(201).json({
      message: "Author created successfully",
      author: newAuthor,
    });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/authors/create - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

  exports.updateAuthor = async (req, res) => {
    
    try {
       
      const AuthorModel = authorModel;
      const authorId  = req.params.authorId;
      console.log(authorId);
      
      const { authorName, isActive } = req.body;
  
      // Check if author exists
      const author = await AuthorModel.findById(authorId);
      if (!author) {
        return res.status(404).json({ error: "Author not found" });
      }
  
      // Update author details
      author.authorName = authorName || author.authorName;
      author.isActive = isActive !== undefined ? isActive : author.isActive;
  
      await author.save();
  
      res.status(200).json({
        message: "Author updated successfully",
        data: author
      });
    } catch (err) {
      console.log(time.tds(), req.ip, ` - /api/authors/update - ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.getAllAuthors = async (req, res) => {
    
    try {
       
      const AuthorModel = authorModel;
      const authors = await AuthorModel.find();  // Retrieve all authors
  
      res.status(200).json({
        authorsFetched: true,
        data: authors
      });
    } catch (err) {
      console.log(time.tds(), req.ip, ` - /api/authors/getAll - ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  };
  