const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");

// Define the Listing schema
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image: {
         url:String,
         filename:String
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Pre middleware to delete reviews before the listing is deleted
ListingSchema.pre('findOneAndDelete', async function (next) {
    const doc = await this.model.findOne(this.getQuery()); // Get the document being deleted
    
    if (doc && doc.reviews.length > 0) {  // Check if the listing has reviews
        try {
            // Delete all reviews associated with the listing
            await Review.deleteMany({
                _id: { $in: doc.reviews }  // Delete reviews that are in the reviews array of the listing
            });
            console.log("Associated reviews deleted before listing removal");
        } catch (error) {
            console.error("Error deleting associated reviews:", error);
        }
    }
    
    next();  // Proceed with deleting the listing
});

// Compile the model
const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
