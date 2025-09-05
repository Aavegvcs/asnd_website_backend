const mongoose = require('mongoose');

const travelBlogsSchema = new mongoose.Schema({
    featuredBlog:{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const travelFeaturedBlogsModel =  mongoose.model("travel featured blogs", travelBlogsSchema);

module.exports = travelFeaturedBlogsModel;