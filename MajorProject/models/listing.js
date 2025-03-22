const mongoose = require('mongoose');
const review = require('./review');
const { ref } = require('joi');
const Schema  = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
    title : {
        type  : String,
        required :true
    },
    description : String,
    image: {
        filename: {
          type: String,
          // required: true,
        },
        url: {
          type: String,
          default : "https://images.pexels.com/photos/2304204/pexels-photo-2304204.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load"
          // required: true,
        },
      },
    price : Number,
    location : String,
    country : String,
    reviews : [
      {
        type : Schema.Types.ObjectId,
        ref : "Review" 
      },
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User",
    }
});

listingSchema.post("findOneAndDelete" , async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in :listing.reviews }})
  }
})

const Listing =  mongoose.model("Listing" , listingSchema);

module.exports = Listing;