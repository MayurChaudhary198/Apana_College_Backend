const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


router
 .route("/")
 .get(wrapAsync(listingController.index))
//  .post(validateListing ,isLoggedIn,wrapAsync(listingController.createListing))
 .post(upload.single('listing[image]'),(req, res) => {
    res.send(req.file);
 })

 //New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 
module.exports = router;


//Home Page // index route
// router.get("/",wrapAsync(listingController.index));

//show route
// router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
// router.post("/",validateListing ,isLoggedIn,wrapAsync(listingController.createListing))

//Update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

