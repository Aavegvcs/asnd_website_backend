const express = require("express");
const router = express.Router();

const {
  addBlog,
  getBlogsPaginated,
  updateBlog,
  getBlogsForRecentSlider,
  addCategory,
  getAllCategory,
  getBlogsByCategoryPaginated,
  getBlogById,
  getBlogBySlug,
  getAllBlogsByTag,
} = require("../controllers/blogs");

router.post("/createBlog", addBlog);
router.get("/getBlogsPaginated", getBlogsPaginated);
router.put("/updateBlog/:blogId", updateBlog);
router.get("/getBlogsForRecentSlider", getBlogsForRecentSlider);
router.post("/addCategory", addCategory);
router.get("/getAllCategory", getAllCategory);
router.get(
  "/getBlogsByCategoryPaginated/:category",
  getBlogsByCategoryPaginated
);
router.get("/getBlogById/:id", getBlogById);
router.get("/getBlogBySlug/:slug", getBlogBySlug);
router.get("/getAllBlogsByTag/:tag", getAllBlogsByTag);

module.exports = router;
