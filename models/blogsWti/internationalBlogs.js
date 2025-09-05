const mongoose = require('mongoose');
const internationalBlogSchema = new mongoose.Schema({
    countryName:{type: String, required: true , trim:true},
    stateName:{type: String , trim:true},
    cityName:{type: String , trim:true},
    categories: { type: String, required: true , trim:true },  // Blog category
    title: { type: String, required: true , trim:true },  // Blog title
    slugs: { type: String, required: true , trim:true, unique: true , trim:true },  // URL slug
    tags: { type: String, required: true , trim:true },  // Blog tags
    metadesc: { type: String, required: true , trim:true },  // Meta description
    metatitle: { type: String, required: true , trim:true },  // Meta title
    metakeyword: { type: String, required: true , trim:true },  // Meta keywords
    canonicalurl: { type: String, required: true , trim:true },  // Canonical URL
    readingtime: { type: String, required: true , trim:true },  // Reading time
    paragraph: { type: String, required: true , trim:true },  // Blog content
    image: { type: String, required: true , trim:true },  // Featured Image (Banner)
    author: { type: String, required: true , trim:true },  // Author Name
    toc: { type: [], required:true, trim:true },  // Table of Contents
    expoloreBySeason:{ type:String , trim:true },
    expoloreByTravel: { type:String , trim:true }
}, { timestamps: true });



const internationalBlogsModel =  mongoose.model("international blogs", internationalBlogSchema);

module.exports = internationalBlogsModel;
