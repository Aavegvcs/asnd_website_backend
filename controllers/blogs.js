const authorModel = require("../models/blogs/author");
const BlogCategoryModel = require("../models/blogs/blogCategory");
const blogsModel = require("../models/blogs/blogs");
const time = require("../utils/timestamp");

exports.addBlog = async (req, res) => {
  // Fetch current database connection from the database manager

  try {
    let newSlug = req.body.slugs;
    const {
      categories,
      title,
      discription,
      paragraph,
      img,
      canonicalurl,
      metadesc,
      metatitle,
      metakeyword,
      readingtime,
      tags,
      author,
      toc,
      table,
      schema,
    } = req.body;

    // Validate required fields
    if (
      !author ||
      !newSlug ||
      !categories ||
      !title ||
      !discription ||
      !paragraph ||
      !img ||
      !canonicalurl ||
      !metadesc ||
      !metatitle ||
      !metakeyword ||
      !readingtime ||
      !tags
    ) {
      throw new Error("Required fields are missing in the request body");
    }

    let counter = 1;
    // Access the correct database-specific model
    const Blogs = blogsModel; // Fetch model for current connection

    while (counter <= 100) {
      const foundBlog = await Blogs.findOne({ slugs: newSlug }); // Correct model usage

      if (foundBlog) {
        newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 8)}`;
        counter++;
      } else {
        break; // Exit the loop if a unique slug is found
      }
    }

    if (counter > 100) {
      throw new Error("Unable to generate a unique slug after 100 attempts");
    }

    const blog = new Blogs({
      // Use correct model instance for saving
      categories,
      title,
      discription,
      paragraph,
      slugs: newSlug,
      image: img,
      canonicalurl,
      metadesc,
      metatitle,
      metakeyword,
      readingtime,
      tags,
      author,
      toc: toc || null, // Optional field

      table: table,
      schema: schema,
    });

    await blog
      .save()
      .then((savedBlog) => {
        console.log(
          time.tds(),
          req.ip,
          "- /0auth/addblog --- Blog saved successfully"
        );
        res.status(200).json({ blogAdded: true });
      })
      .catch((saveError) => {
        console.log(
          time.tds(),
          req.ip,
          "- /0auth/addblog -- Error saving blog:"
        );
        res.status(400).json({ blogAdded: false, error: saveError.message });
      });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /0auth/addblog- ${err.message}`);
    res.status(500).json({ blogAdded: false, error: err.message });
  }
};
exports.getBlogsPaginated = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the correct model for the current database connection

    const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
    const limit = 9; // Number of blogs per page

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch total count of blogs for pagination calculation
    const totalBlogs = await Blogs.countDocuments();

    // Fetch blogs for the current page
    const blogs = await Blogs.find({})
      .sort({ createdAt: -1 }) // Sort by latest created
      .skip(skip) // Skip the required number of documents
      .limit(limit); // Limit to 9 blogs per page

    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total number of pages

    res.status(200).json({
      totalBlogs, // Total number of blogs
      totalPages, // Total number of pages
      currentPage: page, // Current page number
      blogs, // Blog data for the current page
    });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /0auth/getBlogsPaginated- ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const {
      categories,
      title,
      discription,
      slugs,
      tags,
      metadesc,
      metatitle,
      metakeyword,
      canonicalurl,
      readingtime,
      paragraph,
      image,
      author,
      toc,

      table,
      schema,
    } = req.body;

    const blog = await blogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Update fields if provided

    blog.categories = categories || blog.categories;
    blog.title = title || blog.title;
    blog.discription = discription || blog.discription;
    blog.slugs = slugs || blog.slugs;
    blog.tags = tags || blog.tags;
    blog.metadesc = metadesc || blog.metadesc;
    blog.metatitle = metatitle || blog.metatitle;
    blog.metakeyword = metakeyword || blog.metakeyword;
    blog.canonicalurl = canonicalurl || blog.canonicalurl;
    blog.readingtime = readingtime || blog.readingtime;
    blog.paragraph = paragraph || blog.paragraph;
    blog.image = image || blog.image;
    blog.author = author || blog.author;

    if (Array.isArray(toc)) blog.toc = toc;
    if (Array.isArray(schema)) blog.schema = schema;
    if (Array.isArray(table)) blog.table = table;

    // await blog.save();
    const updatedBlog = await blogsModel.findByIdAndUpdate(blogId, blog, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getBlogsForRecentSlider = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the correct model for the current database connection

    // Fetch the 5 most recent blogs, sorted by createdAt (descending order)
    const blogs = await Blogs.find()
      .sort({ createdAt: -1 }) // Sort by latest created
      .limit(2); // Limit the results to 5 blogs

    res.status(200).json(blogs); // Send the fetched blogs to the frontend
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /0auth/getBlogsForRecentSlider- ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};
// exports.addCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;

//     if (!categoryName) {
//       throw new Error("Required fields are missing in the request body");
//     }
//     const blogCategory = await BlogCategoryModel.create({
//       categoryName: categoryName.toLowerCase(),
//     });
//     if (!blogCategory) {
//       console.log(time.tds(), "- /blog/addCategory - Category not Added");
//       return res.staus(404).json({
//         status: false,
//         message: "Category not Added",
//       });
//     }

//     console.log(time.tds(), "- /blog/addCategory- Category added successfully");

//     res
//       .status(201)
//       .json({ status: true, message: "Category added successfully" });
//   } catch (err) {
//     console.log(time.tds(), `- /blog/addCategory - ${err.message}`);
//     return res.status(500).json({
//       status: false,
//       message: "Found error when Category Add",
//       error: err.message,
//     });
//   }
// };
exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      throw new Error("Required fields are missing in the request body");
    }

    // Convert to lowercase to keep uniqueness consistent
    const normalizedCategory = categoryName.toLowerCase();

    // Check if category already exists
    const existingCategory = await BlogCategoryModel.findOne({
      categoryName: normalizedCategory,
    });

    if (existingCategory) {
      return res.status(400).json({
        status: false,
        message: "Category already exists",
      });
    }

    // Create new category
    const blogCategory = await BlogCategoryModel.create({
      categoryName: normalizedCategory,
    });

    if (!blogCategory) {
      console.log(time.tds(), "- /blog/addCategory - Category not added");
      return res.status(500).json({
        status: false,
        message: "Category not added",
      });
    }

    console.log(
      time.tds(),
      "- /blog/addCategory - Category added successfully"
    );

    res.status(201).json({
      status: true,
      message: "Category added successfully",
      data: blogCategory,
    });
  } catch (err) {
    console.log(time.tds(), `- /blog/addCategory - ${err.message}`);
    return res.status(500).json({
      status: false,
      message: "Found error when adding category",
      error: err.message,
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const blogCategory = await BlogCategoryModel.find({}).sort({
      createdAt: -1,
    });
    if (!blogCategory) {
      throw new Error("No blog Category found in the database");
    }
    console.log(time.tds(), `-  /getAllCategory-  blog Category found`);
    return res.status(200).json({
      status: true,
      message: "Category found Successfully",
      result: blogCategory,
    });
  } catch (err) {
    console.log(time.tds(), `-  /getAllCategory -  ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByCategoryPaginated = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the blogs model
    const category = req.params.category.toLowerCase(); // Get the category from query params
    const page = parseInt(req.query.page) || 1; // Current page, defaults to 1 if not provided
    const limit = 9; // Number of blogs per page

    // Check if category is provided
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Calculate the number of documents to skip based on current page
    const skip = (page - 1) * limit;

    const categoryImageUrl = await BlogCategoryModel.findOne({
      categoryName: { $regex: new RegExp(`(^|,)${category}(,|$)`, "i") },
    }).select("categoryImageUrl");

    // Find blogs that match the given category with pagination
    const blogsByCategory = await Blogs.find({ categories: category })
      .select("-toc -paragraph") // Select fields to return
      .sort({ createdAt: -1 }) // Sort by the latest blog posts
      .skip(skip) // Skip the previous pages
      .limit(limit); // Limit the results to 9 per page

    // Get the total number of blogs matching the category for pagination calculation
    const totalBlogs = await Blogs.countDocuments({ categories: category });

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // If no blogs found for the given category
    if (blogsByCategory.length === 0) {
      return res.status(200).json({
        error: "No blogs found for the specified category",
      });
    }
    // Return the blogs, along with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      blogs: blogsByCategory,
    });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getblogsbycategory - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};
exports.getBlogById = async (req, res) => {
  try {
    // Get DB connection
    const Blogs = blogsModel; // Access the Blogs model
    const { id } = req.params; // Get the _id from the request parameters

    // Find the blog by its _id
    const blog = await Blogs.findById(id);

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Return the found blog
    res.status(200).json(blog);
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/getblogbyid - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
exports.getBlogBySlug = async (req, res) => {
  try {
    // Get DB connection
    const Blogs = blogsModel; // Access the Blogs model
    const authorModel = auhtorBlogsModel; // Access the Blogs model
    const { slug } = req.params;
    let authorData = "";

    let blog = await Blogs.findOne({ slugs: slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await authorModel
      .findOne({ authorName: blog.author.toLowerCase() })
      .then((result) => {
        const { authorName, bio } = result;
        authorData = {
          authorName: authorName,
          bio: bio,
        };
        console.log("Fetched author data success!");
      })
      .catch((err) => {
        console.log("Error fetching author data: ", err);
      });

    res
      .status(200)
      .json({ blogFound: true, blog: blog, authorData: authorData });
  } catch (error) {
    res
      .status(500)
      .json({ blogFound: false, message: "Error fetching blog", error });
  }
};
exports.getAllBlogsByTag = async (req, res) => {
  try {
    const Blogs = blogsModel;

    // Extract the tag from the URL parameter
    const tagName = req.params.tag.trim();
    const { page = 1 } = req.query; // Default to page 1 if not provided
    const limit = 9; // Number of blogs per page

    // Find all blogs that contain the specified tag
    const blogs = await Blogs.find({
      tags: { $regex: new RegExp(`(^|,)${tagName}(,|$)`, "i") }, // Match exact tag in a comma-separated list
    })
      .skip((page - 1) * limit) // Skip the records for the current page
      .limit(limit) // Limit to the specified number of blogs
      .exec();

    const total = await Blogs.countDocuments({
      tags: { $regex: new RegExp(`(^|,)${tagName}(,|$)`, "i") }, // Count only blogs with the specified tag
    });

    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found with this tag" });
    }

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(total / limit), // Total number of pages
      currentPage: Number(page), // Current page number
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
};
