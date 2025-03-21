const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")



const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
    
}

//Home Page // index route
router.get("/",wrapAsync( async (req, res) => {
   const allListing=  await Listing.find({});
   res.render("listings/index.ejs", { allListing })
}));

//New route
router.get("/new",isLoggedIn,wrapAsync( async (req, res) => {
    res.render("listings/new.ejs")
}));

//show route
router.get("/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    console.log(listing);
    
    res.render("listings/show.ejs",{listing})
}));

//Create Route
router.post("/",validateListing ,isLoggedIn,wrapAsync( async (req,res,next) => {   
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   await newListing.save();  
   req.flash("success" , "New Listing Created!")
   res.redirect("/listings");
}))

//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}));

//Update route
router.put("/:id",validateListing,isLoggedIn,wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success" , "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedIn,wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted")
    res.redirect("/listings");
}));

module.exports = router;