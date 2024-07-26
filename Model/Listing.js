const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    }
});

const Listing = mongoose.model("Listing",ListingSchema);

module.exports = Listing;