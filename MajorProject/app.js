const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { log } = require('console');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");


const listenings = require("./routes/listing.js");
const reviews = require('./routes/review.js');

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



app.use("/listings" , listenings)

app.use("/listings/:id/reviews", reviews)









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