const BlogCategoryModel = require("../models/blogsWti/blogCategory");
const blogsModel = require("../models/blogsWti/blogs");
const featuredBlogsModel = require("../models/blogsWti/featuredBlogs");
const countrywiseBlogsModel = require("../models/blogsWti/countrywiseBlogs");
const internationalFeaturedBlogs = require("../models/blogsWti/internationalFeaturedBlogs");
const time = require("../utils/timestamp");
const travelwiseModel = require("../models/blogsWti/travelwiseBlogs");
const BlogSeasonTypesModel = require("../models/blogsWti/blogSeasonTypes");
const internationalBlogsModel = require("../models/blogsWti/internationalBlogs");
const auhtorBlogsModel = require("../models/blogsWti/blogAuthors");

//
const travelFeaturedBlogs = require("../models/blogsWti/travelFeaturedBlogs");
const seasonFeaturedBlogs = require("../models/blogsWti/seasonFeaturedBlogs");
// Blog Controller

exports.addBlog = async (req, res) => {
  // Fetch current database connection from the database manager

  try {
    let newSlug = req.body.slugs;
    const {
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason,
      expoloreByTravel,
      table,
      schema,
    } = req.body;

    // Validate required fields
    if (
      !countryName ||
      !author ||
      !newSlug ||
      !categories ||
      !title ||
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
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason: expoloreBySeason || null, // Optional field
      expoloreByTravel: expoloreByTravel || null, // Optional field
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

// exports.updateBlog = async (req, res) => {
//   try {
//     const BlogsModel = blogsModel;
//     const blogId = req.params.blogId;
//     // console.log(blogId);

//     const {
//       countryName,
//       stateName,
//       cityName,
//       categories,
//       title,
//       slugs,
//       tags,
//       metadesc,
//       metatitle,
//       metakeyword,
//       canonicalurl,
//       readingtime,
//       paragraph,
//       image,
//       author,
//       toc,
//       expoloreBySeason,
//       expoloreByTravel,
//       table,
//       schema,
//     } = req.body;

//     // Check if the blog exists
//     const blog = await BlogsModel.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ error: "Blog not found" });
//     }

//     // Update blog details
//     blog.countryName = countryName || blog.countryName;
//     blog.stateName = stateName || blog.stateName;
//     blog.cityName = cityName || blog.cityName;
//     blog.categories = categories || blog.categories;
//     blog.title = title || blog.title;
//     blog.slugs = slugs || blog.slugs;
//     blog.tags = tags || blog.tags;
//     blog.metadesc = metadesc || blog.metadesc;
//     blog.metatitle = metatitle || blog.metatitle;
//     blog.metakeyword = metakeyword || blog.metakeyword;
//     blog.canonicalurl = canonicalurl || blog.canonicalurl;
//     blog.readingtime = readingtime || blog.readingtime;
//     blog.paragraph = paragraph || blog.paragraph;
//     blog.image = image || blog.image;
//     blog.author = author || blog.author;
//     blog.toc = toc || blog.toc;
//     blog.expoloreBySeason =
//       expoloreBySeason !== undefined ? expoloreBySeason : blog.expoloreBySeason;
//     blog.expoloreByTravel =
//       expoloreByTravel !== undefined ? expoloreByTravel : blog.expoloreByTravel;
//     blog.table = table || blog.table;
//     blog.schema = schema || blog.schema;

//     console.log('blog', blog)

//     await blog.save();

//     res.status(200).json({
//       message: "Blog updated successfully",
//       data: blog,
//     });
//   } catch (err) {
//     console.log(time.tds(), req.ip, ` - /api/blogs/update - ${err.message}`);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const {
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason,
      expoloreByTravel,
      table,
      schema,
    } = req.body;

    const blog = await blogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Update fields if provided
    blog.countryName = countryName || blog.countryName;
    blog.stateName = stateName || blog.stateName;
    blog.cityName = cityName || blog.cityName;
    blog.categories = categories || blog.categories;
    blog.title = title || blog.title;
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

    if (typeof expoloreBySeason === "string")
      blog.expoloreBySeason = expoloreBySeason;
    if (typeof expoloreByTravel === "string")
      blog.expoloreByTravel = expoloreByTravel;

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

exports.addFeaturedBlog = async (req, res) => {
  try {
    const FeaturedBlogs = featuredBlogsModel;
    const { blogId } = req.body; // Only blogId is expected in the request body

    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await blogsModel.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await FeaturedBlogs.findOne({
      featuredBlog: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already featured" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newFeaturedBlog = new FeaturedBlogs({
      featuredBlog: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });

    // Save the featured blog
    await newFeaturedBlog
      .save()
      .then((savedFeaturedBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedFeaturedBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/addfeaturedblog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/addfeaturedblog - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedBlogs = async (req, res) => {
  try {
    const FeaturedBlogs = featuredBlogsModel; // Access the featuredBlogs model
    const Blogs = blogsModel;

    // Find active featured blogs, populate the blog details, and limit to 5
    const activeFeaturedBlogs = await FeaturedBlogs.find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: Blogs,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(5); // Limit to 5 blogs

    res.status(200).json(activeFeaturedBlogs);
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/featuredblogs - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.addCountrywiseBlog = async (req, res) => {
  try {
    const countrywiseBlog = countrywiseBlogsModel;
    const { blogId } = req.body; // Only blogId is expected in the request body

    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await blogsModel.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await countrywiseBlog.findOne({
      countrywiseBlogs: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already added" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newCountryBlog = new countrywiseBlog({
      countrywiseBlogs: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });
    // Save the featured blog
    await newCountryBlog
      .save()
      .then((savedCountryBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedCountryBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/countryWiseBlog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/countryWiseBlog - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.getCountrywiseBlogs = async (req, res) => {
  try {
    const countrywiseBlogs = countrywiseBlogsModel; // Access the countrywiseBlogs model
    const Blogs = blogsModel;

    // Find active featured blogs, populate the blog details, and limit to 5
    const activecountrywiseBlogs = await countrywiseBlogs
      .find({ isActive: true })
      .populate({
        path: "countrywiseBlogs",
        model: Blogs,
        select:
          "title slugs image author categories readingtime countryName cityName stateName createdAt", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(5); // Limit to 5 blogs

    res.status(200).json(activecountrywiseBlogs);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/countrywiseBlogs - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsForRecentSlider = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the correct model for the current database connection

    // Fetch the 5 most recent blogs, sorted by createdAt (descending order)
    const blogs = await Blogs.find()
      .sort({ createdAt: -1 }) // Sort by latest created
      .limit(5); // Limit the results to 5 blogs

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

exports.addTravelwiseBlog = async (req, res) => {
  try {
    const travelwiseBlog = travelwiseModel;
    const { blogId } = req.body; // Only blogId is expected in the request body

    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await blogsModel.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await travelwiseBlog.findOne({
      travelwiseBlogs: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already added" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newTravelBlog = new travelwiseBlog({
      travelwiseBlogs: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });
    // Save the featured blog
    await newTravelBlog
      .save()
      .then((savedTravelBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedTravelBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/travelwiseBlog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/travelwiseBlog - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.getTravelwiseBlog = async (req, res) => {
  try {
    const travelwiseBlog = travelwiseModel; // Access the travelwiseBlogs model
    const Blogs = blogsModel;
    const travelType = await blogsModel.distinct("expoloreByTravel", {
      expoloreByTravel: { $nin: ["", " ", null] },
    });

    const blogs = (
      await Promise.all(
        travelType.map(async (travel) => {
          return await Blogs.find({ isActive: true, expoloreByTravel: travel })
            .select(
              "title slugs image author categories readingtime expoloreByTravel countryName createdAt"
            )
            .sort({ createdAt: -1 }) // Sort by the latest featured blog
            .limit(3); // Limit to 5 blogs
        })
      )
    ).flat();
    // console.log(blogs)

    // Find active featured blogs, populate the blog details, and limit to 5
    // const activetravelwiseBlogs = await travelwiseBlog
    //   .find({ isActive: true })
    //   .populate({
    //     path: "travelwiseBlogs",
    //     model: Blogs,
    //     select:
    //       "title slugs image author categories readingtime expoloreByTravel createdAt", // Select fields to show
    //   })
    //   .sort({ createdAt: -1 }) // Sort by the latest featured blog
    //   .limit(5); // Limit to 5 blogs

    res.status(200).json(blogs);
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/travelwiseBlog - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByTravelTypePaginated = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the blogs model
    const Travel = req.params.travelType.toLowerCase(); // Get the Travel from query params
    const page = parseInt(req.query.page) || 1; // Current page, defaults to 1 if not provided
    const limit = 9; // Number of blogs per page

    // Check if Travel is provided
    if (!Travel) {
      return res.status(400).json({ error: "Travel is required" });
    }

    // Calculate the number of documents to skip based on current page
    const skip = (page - 1) * limit;

    // Find blogs that match the given Travel with pagination
    const blogsByTravel = await Blogs.find({ expoloreByTravel: Travel })
      .select(
        "title slugs image author categories readingtime expoloreByTravel paragraph countryName createdAt"
      ) // Select fields to return
      .sort({ createdAt: -1 }) // Sort by the latest blog posts
      .skip(skip) // Skip the previous pages
      .limit(limit); // Limit the results to 9 per page

    // Get the total number of blogs matching the Travel for pagination calculation
    const totalBlogs = await Blogs.countDocuments({ expoloreByTravel: Travel });

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // If no blogs found for the given Travel
    if (blogsByTravel.length === 0) {
      return res
        .status(404)
        .json({ error: "No blogs found for the specified Travel" });
    }

    // Return the blogs, along with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      blogs: blogsByTravel,
    });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getblogsbyTravel - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// seasonTypeController.js
exports.addSeasonType = async (req, res) => {
  try {
    const SeasonType = BlogSeasonTypesModel;
    const { seasonTypeName, imageUrl } = req.body;

    // Check if seasonTypeName and imageUrl are provided
    if (!seasonTypeName || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Season type name and image URL are required" });
    }

    // Create a new season type
    const newSeasonType = new SeasonType({
      seasonTypeName,
      imageUrl,
      isActive: true, // Automatically set to true
    });

    // Save the season type
    await newSeasonType
      .save()
      .then((savedSeasonType) => {
        res
          .status(200)
          .json({ seasonTypeAdded: true, seasonType: savedSeasonType });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/addseasontype - Error saving season type:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(time.tds(), req.ip, ` - /api/addseasontype - ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// seasonTypeController.js
exports.getSeasonTypes = async (req, res) => {
  try {
    const SeasonType = BlogSeasonTypesModel;
    // Find all active season types
    const activeSeasonTypes = await SeasonType.find({ isActive: true })
      .select("seasonTypeName imageUrl createdAt") // Select fields to show
      .sort({ createdAt: -1 }) // Sort by the latest added season type
      .limit(10); // Limit to 10 season types

    res.status(200).json(activeSeasonTypes);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getactiveseasontypes - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// blogController.js
exports.getBlogsBySeasonPaginated = async (req, res) => {
  try {
    const Blogs = blogsModel; // Access the blogs model
    const season = req.params.season.toLowerCase(); // Get the season from query params
    const page = parseInt(req.query.page) || 1; // Current page, defaults to 1 if not provided
    const limit = 9; // Number of blogs per page

    // Check if season is provided
    if (!season) {
      return res.status(400).json({ error: "Season is required" });
    }

    // Calculate the number of documents to skip based on current page
    const skip = (page - 1) * limit;

    // Find blogs that match the given season with pagination
    const blogsBySeason = await Blogs.find({
      expoloreBySeason: new RegExp(season, "i"),
    })
      .select(
        "title slugs image author categories readingtime expoloreBySeason paragraph countryName createdAt"
      ) // Select fields to return
      .sort({ createdAt: -1 }) // Sort by the latest blog posts
      .skip(skip) // Skip the previous pages
      .limit(limit); // Limit the results to 9 per page

    // Get the total number of blogs matching the season for pagination calculation
    const totalBlogs = await Blogs.countDocuments({ expoloreBySeason: season });

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // If no blogs found for the given season
    if (blogsBySeason.length === 0) {
      return res
        .status(404)
        .json({ error: "No blogs found for the specified season" });
    }

    // Return the blogs, along with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      blogs: blogsBySeason,
    });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getblogsbyseason - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// const getBlogWithPagination = async (req, res) => {
//   try {
//     const { pageNumber, pageSize = 3 } = req.query;

//     if (!pageNumber) {
//       throw new Error("Required fields are missing in the request body");
//     }
//     if (parseInt(pageNumber) < 1) {
//       throw new Error("Page number should be greater than or equal to 1");
//     }

//     // Calculate skip value based on pageNumber and pageSize
//     const skip = (pageNumber - 1) * pageSize;
//     const docsCount = await Blogs.countDocuments();
//     const pageCount = Math.ceil(docsCount / pageSize);

//     // Query data with pagination
//     const limitBlogs = await Blogs.find({})
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(pageSize);
//     if (limitBlogs.length == 0) {
//       console.log(
//         time.tds(),

//         ` - /blog/getBlogWithPagination - Error in finding blogs with pagination`
//       );
//       return res.status(404).json({ status: false, message: "No Blog found" });
//     }

//     console.log(
//       time.tds(),
//       "-/blog/getBlogWithPagination--- Blog Found Successfully"
//     );
//     return res.status(200).json({
//       status: true,
//       message: "Blog Found Successfully",
//       result: limitBlogs,
//       totalPage: pageCount,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, error: err.message });
//   }
// };

exports.addCategory = async (req, res) => {
  try {
    const { categoryName} = req.body;

    if (!categoryName ) {
      throw new Error("Required fields are missing in the request body");
    }
    const blogCategory = await BlogCategoryModel.create({
      categoryName: categoryName.toLowerCase(),
    
    });
    if (!blogCategory) {
      console.log(time.tds(), "- /blog/addCategory - Category not Added");
      return res.staus(404).json({
        status: false,
        message: "Category not Added",
      });
    }

    console.log(time.tds(), "- /blog/addCategory- Category added successfully");

    res
      .status(201)
      .json({ status: true, message: "Category added successfully" });
  } catch (err) {
    console.log(time.tds(), `- /blog/addCategory - ${err.message}`);
    return res.status(500).json({
      status: false,
      message: "Found error when Category Add",
      error: err.message,
    });
  }
};
// --------------------- Get All Category
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

// blogController.js
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
        categoryImageUrl: categoryImageUrl,
      });
    }
    // Return the blogs, along with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      blogs: blogsByCategory,
      categoryImageUrl: categoryImageUrl,
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

exports.addInternationalBlog = async (req, res) => {
  // Fetch current database connection from the database manager

  try {
    let newSlug = req.body.slugs;
    const {
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason,
      expoloreByTravel,
    } = req.body;

    // Validate required fields
    if (
      !countryName ||
      !author ||
      !newSlug ||
      !categories ||
      !title ||
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
    const Blogs = internationalBlogsModel; // Fetch model for current connection

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
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason: expoloreBySeason || null, // Optional field
      expoloreByTravel: expoloreByTravel || null, // Optional field
    });

    await blog
      .save()
      .then((savedBlog) => {
        console.log(
          time.tds(),
          req.ip,
          "- /0auth/addInternationalBlog --- Blog saved successfully"
        );
        res.status(200).json({ blogAdded: true });
      })
      .catch((saveError) => {
        console.log(
          time.tds(),
          req.ip,
          "- /0auth/addInternationalBlog -- Error saving blog:"
        );
        res.status(400).json({ blogAdded: false, error: saveError.message });
      });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /0auth/addInternationalBlog- ${err.message}`
    );
    res.status(500).json({ blogAdded: false, error: err.message });
  }
};

exports.getAllInternationalPaginated = async (req, res) => {
  try {
    const Blogs = internationalBlogsModel; // Access the correct model for the current database connection

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
      ` - /0auth/getAllInternationalPaginated- ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getInternationalSliderBlog = async (req, res) => {
  try {
    const Blogs = internationalBlogsModel; // Access the correct model for the current database connection

    // Fetch the 5 most recent blogs, sorted by createdAt (descending order)
    const blogs = await Blogs.find()
      .sort({ createdAt: -1 }) // Sort by latest created
      .limit(5); // Limit the results to 5 blogs

    res.status(200).json(blogs); // Send the fetched blogs to the frontend
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /0auth/getInternationalSliderBlog- ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getInternationalBlogById = async (req, res) => {
  try {
    // Get DB connection
    const Blogs = internationalBlogsModel; // Access the Blogs model
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
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getInternationalBlogById - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getInternationalBlogBySlug = async (req, res) => {
  try {
    // Get DB connection
    const { slug } = req.params;

    // Find the blog by its _id
    const blog = await internationalBlogsModel.findOne({ slugs: slug.trim() });

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ error: "International Blog not found" });
    }

    console.log("International Blog found");
    // Return the found blog
    res.status(200).json(blog);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getInternationalBlogBySlug - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.updateInternationalBlog = async (req, res) => {
  try {
    const BlogsModel = internationalBlogsModel;
    const blogId = req.params.blogId;
    // console.log(blogId);

    const {
      countryName,
      stateName,
      cityName,
      categories,
      title,
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
      expoloreBySeason,
      expoloreByTravel,
    } = req.body;

    // Check if the blog exists
    const blog = await BlogsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Update blog details
    blog.countryName = countryName || blog.countryName;
    blog.stateName = stateName || blog.stateName;
    blog.cityName = cityName || blog.cityName;
    blog.categories = categories || blog.categories;
    blog.title = title || blog.title;
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
    blog.toc = toc || blog.toc;
    blog.expoloreBySeason =
      expoloreBySeason !== undefined ? expoloreBySeason : blog.expoloreBySeason;
    blog.expoloreByTravel =
      expoloreByTravel !== undefined ? expoloreByTravel : blog.expoloreByTravel;

    await blog.save();

    res.status(200).json({
      message: "International Blog updated successfully",
      data: blog,
    });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/blogs/updateInternationalBlog - ${err.message}`
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
      console.log("getting blog from international");
      blog = await internationalBlogsModel.findOne({ slugs: slug });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
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

exports.getAllTravelwiseBlogsPaginated = async (req, res) => {
  try {
    const Blogs = blogsModel;
    const InternationalBlogs = internationalBlogsModel;
    const { page = 1 } = req.query;
    const limit = 3; // 3 from each collection per season

    const travelType = await Blogs.distinct("expoloreByTravel", {
      expoloreByTravel: { $exists: true, $nin: ["", " ", null] },
    });
    const internationalTravelType = await InternationalBlogs.distinct(
      "expoloreByTravel",
      {
        expoloreByTravel: { $exists: true, $nin: ["", " ", null] },
      }
    );
    // get All Travel type of Blog
    const travelBlogs = (
      await Promise.all(
        travelType.map(async (travel) => {
          let blog = await Blogs.find({
            expoloreByTravel: travel,
          })
            .select("-paragraph -toc")
            .limit(limit) // Limit results to 9 blogs per page
            .skip((page - 1) * limit); // Skip records based on the current page;

          return blog;
        })
      )
    ).flat();

    const internationalTravelBlogs = (
      await Promise.all(
        internationalTravelType.map(async (travel) => {
          let blog = await InternationalBlogs.find({
            expoloreByTravel: travel,
          })
            .select("-paragraph -toc")
            .limit(limit) // Limit results to 9 blogs per page
            .skip((page - 1) * limit); // Skip records based on the current page;

          return blog;
        })
      )
    ).flat();
    const indiaTotalBlog = await Blogs.countDocuments({
      expoloreByTravel: { $nin: ["", " ", null] },
    });
    const intlTotalBlog = await InternationalBlogs.countDocuments({
      expoloreByTravel: { $nin: ["", null] },
    });
    const total = Math.min(
      Math.ceil(indiaTotalBlog / limit),
      Math.ceil(intlTotalBlog / limit)
    );
    res.status(200).json({
      travelBlogs: [...travelBlogs, ...internationalTravelBlogs],
      totalPages: total,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving travel blogs", error });
  }
};
exports.getAllSeasonBlogsPaginated = async (req, res) => {
  // try {
  //   const limitPerGroup = 3;
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 5; // Number of seasons per page
  //   const skip = (page - 1) * limit;

  //   // 1. Get 3 India blogs per season
  //   const indiaSeasonData = await blogsModel.aggregate([
  //     {
  //       $match: {
  //         expoloreBySeason: { $nin: ["", " ", null] },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$expoloreBySeason",
  //         blogs: { $push: "$$ROOT" },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         blogs: {
  //           $map: {
  //             input: { $slice: ["$blogs", limitPerGroup] },
  //             as: "blog",
  //             in: {
  //               $mergeObjects: [
  //                 "$$blog",
  //                 { toc: "$$REMOVE", paragraph: "$$REMOVE" },
  //               ],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ]);
  //   // 2. Get 3 International blogs per season
  //   const internationalSeasonData = await internationalBlogsModel.aggregate([
  //     {
  //       $match: {
  //         expoloreBySeason: { $nin: ["", " ", null] },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$expoloreBySeason",
  //         blogs: { $push: "$$ROOT" },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         blogs: {
  //           $map: {
  //             input: { $slice: ["$blogs", limitPerGroup] },
  //             as: "blog",
  //             in: {
  //               $mergeObjects: [
  //                 "$$blog",
  //                 { toc: "$$REMOVE", paragraph: "$$REMOVE" },
  //               ],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ]);
  //   // 3. Merge by season
  //   const seasonMap = [];
  //   indiaSeasonData.forEach(({ _id, blogs }) => {
  //     seasonMap.push(...blogs);
  //   });
  //   internationalSeasonData.forEach(({ _id, blogs }) => {
  //     seasonMap.push(...blogs);
  //   });
  //   const groupedSeasonData = Object.values(seasonMap);
  //   const paginatedSeasons = groupedSeasonData.slice(skip, skip + limit);
  //   const totalSeasons = groupedSeasonData.length;
  //   // console.log(totalSeasons);
  //   const totalPages = Math.ceil(totalSeasons / limit);
  //   res.status(200).json({
  //     blogs: paginatedSeasons,
  //     totalPages,
  //     currentPage: page,
  //   });
  // } catch (error) {
  //   console.error("Error fetching all season data:", error);
  //   res.status(500).json({ success: false, message: "Server error", error });
  // }
  try {
    const Blogs = blogsModel;
    const InternationalBlogs = internationalBlogsModel;
    const { page = 1 } = req.query;
    const limit = 3; // 3 from each collection per season

    // Get distinct non-empty seasons from both collections
    const seasonsFromBlogs = await Blogs.distinct("expoloreBySeason", {
      expoloreBySeason: { $nin: ["", " ", null] },
    });

    const seasonsFromInternational = await InternationalBlogs.distinct(
      "expoloreBySeason",
      {
        expoloreBySeason: { $nin: ["", " ", null] },
      }
    );

    // Fetch 3 blogs per season from each collection
    const indiaSeasonBlogs = (
      await Promise.all(
        seasonsFromBlogs.map(async (season) => {
          return await Blogs.find({ expoloreBySeason: season })
            .select("-paragraph -toc")
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
        })
      )
    ).flat();
    const internationalSeasonBlogs = (
      await Promise.all(
        seasonsFromInternational.map(async (season) => {
          let blog = await InternationalBlogs.find({
            expoloreBySeason: season,
          })
            .select("-paragraph -toc")
            .limit(limit) // Limit results to 9 blogs per page
            .skip((page - 1) * limit); // Skip records based on the current page;

          return blog;
        })
      )
    ).flat();

    const indiaTotalBlog = await Blogs.countDocuments({
      expoloreBySeason: { $nin: ["", " ", null] },
    });

    const intlTotalBlog = await InternationalBlogs.countDocuments({
      expoloreBySeason: { $nin: ["", null] },
    });

    const total = Math.min(
      Math.ceil(indiaTotalBlog / limit),
      Math.ceil(intlTotalBlog / limit)
    );

    res.status(200).json({
      blogs: [...indiaSeasonBlogs, ...internationalSeasonBlogs],
      totalPages: total,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving season blogs", error });
  }
};

exports.getAllSeasonBlogsPaginatedAgg = async (req, res) => {
  try {
    const limitPerGroup = 3;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Number of seasons per page
    const skip = (page - 1) * limit;

    // 1. Get 3 India blogs per season
    const indiaSeasonData = await blogsModel.aggregate([
      {
        $match: {
          expoloreBySeason: { $nin: ["", " ", null] },
        },
      },
      {
        $group: {
          _id: "$expoloreBySeason",
          blogs: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          blogs: {
            $map: {
              input: { $slice: ["$blogs", limitPerGroup] },
              as: "blog",
              in: {
                $mergeObjects: [
                  "$$blog",
                  { toc: "$$REMOVE", paragraph: "$$REMOVE" },
                ],
              },
            },
          },
        },
      },
    ]);

    // 2. Get 3 International blogs per season
    const internationalSeasonData = await internationalBlogsModel.aggregate([
      {
        $match: {
          expoloreBySeason: { $nin: ["", " ", null] },
        },
      },
      {
        $group: {
          _id: "$expoloreBySeason",
          blogs: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          blogs: {
            $map: {
              input: { $slice: ["$blogs", limitPerGroup] },
              as: "blog",
              in: {
                $mergeObjects: [
                  "$$blog",
                  { toc: "$$REMOVE", paragraph: "$$REMOVE" },
                ],
              },
            },
          },
        },
      },
    ]);

    // 3. Merge by season
    const seasonMap = [];

    indiaSeasonData.forEach(({ _id, blogs }) => {
      seasonMap.push(...blogs);
    });

    internationalSeasonData.forEach(({ _id, blogs }) => {
      seasonMap.push(...blogs);
    });

    const groupedSeasonData = Object.values(seasonMap);
    const paginatedSeasons = groupedSeasonData.slice(skip, skip + limit);
    const totalSeasons = groupedSeasonData.length;
    const totalPages = Math.ceil(totalSeasons / limit);

    res.status(200).json({
      blogs: paginatedSeasons,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching all season data:", error);
    res.status(500).json({ success: false, message: "Server error", error });
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

exports.getAuthorWiseBlog = async (req, res) => {
  try {
    const Blogs = blogsModel;
    const { author, page = 1, limit = 9 } = req.body;

    const requiredFields = ["author"]; // List of required fields

    for (const field of requiredFields) {
      // Check if the field exists and is not null or undefined
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is missing. Please provide all required fields.`,
        });
      }
    }

    // Find all blogs that contain the specified tag
    const blogs = await Blogs.find({
      author: { $regex: new RegExp(`(^|,)${author}(,|$)`, "i") }, // Match exact tag in a comma-separated list
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit) // Skip the records for the current page
      .limit(limit) // Limit to the specified number of blogs
      .exec();

    const total = await Blogs.countDocuments({
      author: { $regex: new RegExp(`(^|,)${author}(,|$)`, "i") }, // Count only blogs with the specified tag
    });

    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found with this author" });
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

exports.getRecentBlogByFlag = async (req, res) => {
  try {
    const Blogs = blogsModel;
    const InternationalBlogs = internationalBlogsModel;

    const { flag, page = 1, limit = 9 } = req.body;

    // Validate the required field
    if (!flag) {
      return res.status(400).json({
        success: false,
        message: "Flag is missing. Please provide all required fields.",
      });
    }

    // Initialize variables for query, total count, and collection
    let blogs = [];
    let total = 0;

    // Determine query and collection based on the flag
    if (flag === "season") {
      blogs = await Blogs.find({ expoloreBySeason: { $nin: ["", null] } }) // Exclude empty exploreBySeason
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      total = await Blogs.countDocuments({
        expoloreBySeason: { $nin: ["", null] },
      }); // Count relevant blogs
    } else if (flag === "travel") {
      blogs = await Blogs.find({ expoloreByTravel: { $nin: ["", null] } }) // Exclude empty exploreByTravel
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      total = await Blogs.countDocuments({
        expoloreByTravel: { $nin: ["", null] },
      }); // Count relevant blogs
    } else if (flag === "international") {
      blogs = await InternationalBlogs.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      total = await InternationalBlogs.countDocuments(); // Count all international blogs
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid flag provided. Please use 'season', 'travel', or 'international'.",
      });
    }

    // Check if blogs were found
    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found for the given flag.",
      });
    }

    // Respond with blogs and pagination info
    res.status(200).json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: "Error retrieving blogs.",
      error: error.message,
    });
  }
};

exports.getTravelWiseFiltered = async (req, res) => {
  try {
    const Blogs = blogsModel;
    const { flag, page = 1, limit = 9 } = req.body;

    const requiredFields = ["flag"]; // List of required fields

    for (const field of requiredFields) {
      // Check if the field exists and is not null or undefined
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is missing. Please provide all required fields.`,
        });
      }
    }

    const blogs = await Blogs.find({
      expoloreByTravel: { $regex: new RegExp(`(^|,)${flag}(,|$)`, "i") },
    }) // Exclude empty exploreByTravel
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blogs.countDocuments({
      expoloreByTravel: { $regex: new RegExp(`(^|,)${flag}(,|$)`, "i") },
    });

    // Check if blogs were found
    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found for the given flag.",
      });
    }

    // Respond with blogs and pagination info
    res.status(200).json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
};
// for international featured blogs
exports.addInternationalFeaturedBlog = async (req, res) => {
  try {
    const FeaturedBlogs = internationalFeaturedBlogs;
    const Blogs = internationalBlogsModel;
    const { blogId } = req.body; // Only blogId is expected in the request body
    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await Blogs.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await FeaturedBlogs.findOne({
      featuredBlog: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already featured" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newFeaturedBlog = new FeaturedBlogs({
      featuredBlog: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });

    // Save the featured blog
    await newFeaturedBlog
      .save()
      .then((savedFeaturedBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedFeaturedBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/addInternationalFeaturedBlog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/addInternationalFeaturedBlog - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getInternationalFeaturedBlogs = async (req, res) => {
  try {
    const FeaturedBlogs = internationalFeaturedBlogs; // Access the featuredBlogs model
    const Blogs = internationalBlogsModel;

    // Find active featured blogs, populate the blog details, and limit to 5
    const activeFeaturedBlogs = await FeaturedBlogs.find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: Blogs,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(5); // Limit to 5 blogs

    res.status(200).json(activeFeaturedBlogs);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getInternationalFeaturedBlogs - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// for season featured blogs
exports.addSeasonFeaturedBlog = async (req, res) => {
  try {
    const FeaturedBlogs = seasonFeaturedBlogs;
    const Blogs = blogsModel;
    const { blogId } = req.body; // Only blogId is expected in the request body
    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await Blogs.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await FeaturedBlogs.findOne({
      featuredBlog: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already featured" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newFeaturedBlog = new FeaturedBlogs({
      featuredBlog: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });

    // Save the featured blog
    await newFeaturedBlog
      .save()
      .then((savedFeaturedBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedFeaturedBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/addSeasonFeaturedBlog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/addSeasonFeaturedBlog - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getSeasonFeaturedBlogs = async (req, res) => {
  try {
    const FeaturedBlogs = seasonFeaturedBlogs; // Access the featuredBlogs model
    const Blogs = blogsModel;

    // Find active featured blogs, populate the blog details, and limit to 5
    const activeFeaturedBlogs = await FeaturedBlogs.find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: Blogs,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(5); // Limit to 5 blogs

    res.status(200).json(activeFeaturedBlogs);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getSeasonFeaturedBlogs - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// for travel featured blogs
exports.addTravelFeaturedBlog = async (req, res) => {
  try {
    const FeaturedBlogs = travelFeaturedBlogs;
    const Blogs = blogsModel;
    const { blogId } = req.body; // Only blogId is expected in the request body
    // Check if blogId is provided
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Validate that the blog exists
    const blogExists = await Blogs.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if the blog is already featured
    const alreadyFeatured = await FeaturedBlogs.findOne({
      featuredBlog: blogId,
    });
    if (alreadyFeatured) {
      return res.status(400).json({ error: "Blog is already featured" });
    }
    // Create a new featured blog with isActive defaulting to true
    const newFeaturedBlog = new FeaturedBlogs({
      featuredBlog: blogId,
      title: blogExists.title,
      isActive: true, // Automatically set to true
    });

    // Save the featured blog
    await newFeaturedBlog
      .save()
      .then((savedFeaturedBlog) => {
        res.status(200).json({ blogAdded: true, blog: savedFeaturedBlog });
      })
      .catch((error) => {
        console.log(
          time.tds(),
          req.ip,
          ` - /api/addTravelFeaturedBlog - Error saving featured blog:`,
          error
        );
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/addTravelFeaturedBlog - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

exports.getTravelFeaturedBlogs = async (req, res) => {
  try {
    const FeaturedBlogs = travelFeaturedBlogs; // Access the featuredBlogs model
    const Blogs = blogsModel;

    // Find active featured blogs, populate the blog details, and limit to 5
    const activeFeaturedBlogs = await FeaturedBlogs.find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: Blogs,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(5); // Limit to 5 blogs

    res.status(200).json(activeFeaturedBlogs);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getTravelFeaturedBlogs - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};

// featured Blog for blog main page
exports.getAllFeaturedBlogForMainPage = async (req, res) => {
  try {
    // Find active featured blogs, populate the blog details, and limit to 5
    const internationalBlog = await internationalFeaturedBlogs
      .find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: internationalBlogsModel,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 })
      .limit(1);
    const seasonBlog = await seasonFeaturedBlogs
      .find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: blogsModel,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 })
      .limit(1);
    const travelBlog = await travelFeaturedBlogs
      .find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: blogsModel,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 })
      .limit(1);
    const activeFeaturedBlogs = await featuredBlogsModel
      .find({ isActive: true })
      .populate({
        path: "featuredBlog",
        model: blogsModel,
        select:
          "title slugs image author categories readingtime createdAt countryName", // Select fields to show
      })
      .sort({ createdAt: -1 }) // Sort by the latest featured blog
      .limit(1); // Limit to 5 blogs

    res
      .status(200)
      .json([
        ...internationalBlog,
        ...seasonBlog,
        ...travelBlog,
        ...activeFeaturedBlogs,
      ]);
  } catch (err) {
    console.log(
      time.tds(),
      req.ip,
      ` - /api/getAllFeaturedBlogForMainPage - ${err.message}`
    );
    res.status(500).json({ error: err.message });
  }
};
