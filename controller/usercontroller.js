const User = require("../models/user.js");


module.exports.renderRegisterForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.registerUser = (async(req,res,next)=>{
    try {
    let {name,username,email,password} = req.body;
    let user = new User({name,username,email});
    let registeredUser = await User.register(user,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to airbnb");
        res.redirect("/listings");
    });
    } catch (error) {
        req.flash("error",error.message);
    res.redirect("/register");
        
    }
})

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser = async (req,res,next)=>{
    req.flash("success","Welcome back to airbnb");
    const redirectUrl = res.locals.returnTo || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
    
}