const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const { log } = require('console');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema}= require("./schema.js")
const Review = require("./models/review.js");


//Connecting Database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connect to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

//Setting path of View Folder
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"public")));


//Root Page
app.get("/",  (req, res) => {
    res.send("Hi, I am root");
});

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
app.get("/listings",wrapAsync( async (req, res) => {
   const allListing=  await Listing.find({});
   res.render("listings/index.ejs", { allListing })
}));

//New route
app.get("/listings/new",wrapAsync( async (req, res) => {
    res.render("listings/new.ejs")
}));

//show route
app.get("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
}));

//Create Route

app.post("/listings",validateListing ,wrapAsync( async (req,res,next) => {
   
   const newListing = new Listing(req.body.listing);
   await newListing.save();  
   res.redirect("/listings");
}))

//edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

//Update route
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Reviews
//Post Route

app.post("/listings/:id/reviews",async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = await Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);
    
})








// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "by new beach",
//         price: 1200,
//         location: "kalol, Gnadhinagar",
//         country: "India"
//     })

//     await sampleListing.save();
//     console.log("Saved");
//     res.send("Sucessful");
// });
app.all("*",(req ,res, next) => {
    next(new ExpressError(404,"Page Not Found!"))
})

app.use((err, req, res, next) => {
    let { statusCode=500 , message="Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs" ,{ err })
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});