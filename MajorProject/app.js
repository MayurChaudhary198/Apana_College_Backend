if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const Listing = require("./models/listing.js");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { log } = require('console');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listeningRouter = require("./routes/listing.js");
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    Cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

// //Root Page
// app.get("/",  (req, res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser" , async (req,res) => {
//     let fakeUser = new User({
//         email : "mayur@gmail.com",
//         username : "Mayur"
//     })

//     let registerdUser = await User.register(fakeUser , "helloworld");
//     res.send(registerdUser);
// })


app.use("/listings" , listeningRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.get("/search", async (req, res) => {
    const query = req.query.query; // Get the search query from URL
    if (!query) {
        return res.json([]); // Return empty array if no query
    }

    try {
        // Assuming you have a `Listing` model in MongoDB
        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },  // Search in title
                { location: { $regex: query, $options: "i" } },   // Search in city
                { country: { $regex: query, $options: "i" } } // Search in country
            ]
            
        }).limit(5); // Limit results to 5

        res.json(listings); // Send results as JSON
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


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

