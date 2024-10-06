const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {reviewsSchema} = require("../validateschema.js");

module.exports.createReview = async(req,res)=>{
    reviewsSchema.validate(req.body)
    let id = req.params.id;
    let listing = await Listing.findById(id)
    let data = req.body;
    // console.log(data)
    let newreview = new Review(data);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    
    // res.send({review})
    req.flash("success", "Review added successfully")
  
    res.redirect(`/listings/search/${id}`)

}

module.exports.deleteReview = async (req,res)=>{
    let id = req.params.id;
    if (!req.isAuthenticated()) {
        req.session.returnTo = `/listings/search/${req.params.id}`;
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }
    let reviewid = req.params.reviewid;
   
    await Listing.findByIdAndUpdate(id,{$pull:{reviews :reviewid}})
    
    await Review.findByIdAndDelete(reviewid);

    // await Listing.findOne({_id :})
    req.flash("success", "Review deleted successfully")
    res.redirect(`/listings/search/${id}`)
}