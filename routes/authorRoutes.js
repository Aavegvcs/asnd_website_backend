const express = require("express");
const router = express.Router();
const { createAuthor,updateAuthor, getAllAuthors} = require("../controllers/author");
router.post("/createAuthor", createAuthor);
router.get("/getAllAuthors", getAllAuthors);
router.put("/updateAuthor/:authorId", updateAuthor);
module.exports = router;
