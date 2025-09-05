const mongoose = require('mongoose');

const seasonBlogsSchema = new mongoose.Schema({
    featuredBlog:{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const seasonFeaturedBlogsModel =  mongoose.model("season featured blogs", seasonBlogsSchema);

module.exports = seasonFeaturedBlogsModel;