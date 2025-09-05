const mongoose = require('mongoose');

const countrywiseBlogs = new mongoose.Schema({
    countrywiseBlogs:{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
    title: {type:String},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const countrywiseBlogsModel =  mongoose.model("countrywise blogs", countrywiseBlogs);

module.exports = countrywiseBlogsModel;
