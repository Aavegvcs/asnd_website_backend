const mongoose = require('mongoose');

const internationalBlogs = new mongoose.Schema({
    internationalBlog:{ type: mongoose.Schema.Types.ObjectId, ref: 'international blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const internationalBlogsModel =  mongoose.model("internationalslider blogs", internationalBlogs);

module.exports = internationalBlogsModel;
