const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review');
const { listingSchema } = require("../listingSchema");
const User = require("./User");
const ListingSchema = new mongoose.Schema({
    title :{
        type : String,
        require : true,
        // minLength :[4,"Too small ..."],
        // maxLength :[50, "To large"]
    },
    description :{
        type : String,
    },
    image :{
        filename : {
            type : String,
            default : "filename",
            set : (v)=> v ==="" ? "filename" :v , 
            
        },
        url :{
                type : String,
                default : "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        }
    },
    price : {
        type : Number,
        min : [0,"Can not be negative!"],
    },
    location :{
        type : String,
        // minLength :[4,"Too small ..."],
        // maxLength :[200, "To large"]
    },
    country : {
        type : String,
        // minLength :[4,"Too small ..."],
        // maxLength :[200, "To large"]
    },

    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],

    owner :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

ListingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing)
   await Review.deleteMany({_id : {$in : listing.reviews}})
    console.log("all review of a place is deleted : ");
});

const Listing = mongoose.model("Listing",ListingSchema);

module.exports = Listing;