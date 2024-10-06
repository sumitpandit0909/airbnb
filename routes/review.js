const express = require("express");
const router =express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require('../models/reviews.js');
const {reviewsSchema} =require('../validateschema.js');
const {isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewcontroller = require("../controller/reviewcontroller.js")



const validateReview = (req,res,next)=>{
    let {error}= reviewsSchema.validate(req.body);
    if(error){
        res.send(error.details[0].message)
    }else{
        next()
    }
}


// ---------------handling async routes error--------------------
function asyncWrap(fxn){
    return (req,res,next)=>{
        fxn(req,res,next).catch(err=>next(err));
    }
}

class ExpressError extends Error {
    constructor(status,message) {
        super();
        this.status = status;
        this.message = message;
        
    }
}

// -----------------------Review route-------------------
router.post("/submit-review",isLoggedIn,validateReview,  asyncWrap(reviewcontroller.createReview));

// -----------------DELETE REVIEW------------------- 

router.delete("/delete-review/:reviewid",isReviewAuthor, asyncWrap(reviewcontroller.deleteReview));

module.exports = router;