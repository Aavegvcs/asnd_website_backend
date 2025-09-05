const mongoose = require('mongoose');

const featuredBlogsSchema = new mongoose.Schema({
    featuredBlog:{ type: mongoose.Schema.Types.ObjectId, ref: 'international blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const internationalFeaturedBlogsModel =  mongoose.model("international featured blogs", featuredBlogsSchema);

module.exports = internationalFeaturedBlogsModel;