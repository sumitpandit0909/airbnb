const express = require("express");
const router =express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require('../models/reviews.js');
const {isLoggedIn,isOwner} = require("../middleware.js")
const listingcontroller = require("../controller/listingcontroller.js");


const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
// ---------------handling async routes error--------------------
function asyncWrap(fxn){
    return (req,res,next)=>{
        fxn(req,res,next).catch(err=>{req.flash("error",err.message);res.redirect("/listings")});
    }
}

class ExpressError extends Error {
    constructor(status,message) {
        super();
        this.status = status;
        this.message = message;
        
    }
}

// --------------------Home route-----------

router.get("/",asyncWrap(listingcontroller.index));

// ------------------post route---------------------

router.get("/newlisting", isLoggedIn, listingcontroller.renderNewForm)

router.post("/submit-listing",isLoggedIn,upload.single("image"),asyncWrap(listingcontroller.createNewListing));
// ------------------show route--------------------

router.get("/search/:id", asyncWrap(listingcontroller.showListing));

// -----------------------EDit and update route-------------------
router.get("/search/:id/edit",isLoggedIn,isOwner,asyncWrap(listingcontroller.renderEditForm));

router.put("/search/:id",isLoggedIn,isOwner,upload.single("image"),asyncWrap(listingcontroller.updateListing));
// -----------------------Delete route-------------------
router.delete("/search/:id/remove",isOwner, asyncWrap(listingcontroller.deleteListing));

module.exports = router;