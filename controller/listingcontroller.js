const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.index = async (req,res)=>{
    let datas = await Listing.find();
    
    res.render("listings/index.ejs",{datas})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/newlisting.ejs");
}

module.exports.createNewListing = async (req,res)=>{
    // ListingSchema.validate(req.body)
    let data = req.body;
    let newlisting =  new Listing(data);
    newlisting.image = {url:req.file.path,filename:req.file.filename}
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Listing added successfully")
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;

    // Fetch the listing document
    let listing = await Listing.findById(id).populate("owner").populate({path:"reviews",populate:{path:"author"}});
    // console.log(listing)
    if(!listing){
        req.flash("error","Requested Listing does not exist")
        res.redirect("/listings")
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req,res)=>{
    let id = req.params.id;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error","Requested Listing does not exist")
        res.redirect("/listings")
    }
    // console.log(data)

    res.render("listings/edit.ejs",{datas:data})

}

module.exports.updateListing = async (req,res)=>{
    let id = req.params.id;
    let data = req.body;
    
    let listing = await Listing.findByIdAndUpdate(id,data);
    if(typeof req.file  !== "undefined"){

    listing.image ={url:req.file.path,filename:req.file.filename}
    await  listing.save();
    }

    req.flash("success", "Listing updated successfully")
    res.redirect("/listings")
}

module.exports.deleteListing = async (req,res)=>{
    if (!req.isAuthenticated()) {
        req.session.returnTo = `/listings/search/${req.params.id}`;
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }
    let id = req.params.id;
    await Listing.findByIdAndDelete({_id:id});
    req.flash("success", "Listing deleted successfully")
    res.redirect("/listings")
}
