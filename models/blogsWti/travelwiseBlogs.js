const mongoose = require('mongoose');

const travelwiseSchema = new mongoose.Schema({
    travelwiseBlogs:{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
    title: {type:String,required:true,trim:true},
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const travelwiseModel =  mongoose.model("travelwise blogs", travelwiseSchema);

module.exports = travelwiseModel;