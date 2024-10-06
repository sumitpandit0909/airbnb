const express = require("express");
const router =express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require('../models/reviews.js');
const passport = require("passport");
const {storeReturnTo} = require("../middleware.js");
const usercontroller = require("../controller/usercontroller.js");

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
router
.route("/register")
.get(usercontroller.renderRegisterForm)
.post(usercontroller.registerUser);
// router.get("/register",usercontroller.renderRegisterForm);

// router.post("/register",usercontroller.registerUser);
router
.route("/login")
.get(usercontroller.renderLoginForm)
.post(storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),asyncWrap(usercontroller.loginUser));


// router.get("/login",usercontroller.renderLoginForm);

// router.post("/login",storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),asyncWrap(usercontroller.loginUser));

router.get("/logout",usercontroller.logoutUser);

module.exports = router;