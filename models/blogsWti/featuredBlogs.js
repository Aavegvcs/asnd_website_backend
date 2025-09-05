const mongoose = require('mongoose');

const featuredBlogs = new mongoose.Schema({
    featuredBlog:{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const featuredBlogsModel =  mongoose.model("featured blogs", featuredBlogs);

module.exports = featuredBlogsModel;