
express = require('express');
router = express.Router({mergeParams: true});
//-----------------------------

const Listing = require("../Model/Listing");
const ExError = require("../Errorhandling/errorclass");
const Reviews = require('../Model/review'); // Import the Reviews model
const {reviewSchema} = require('../ReviewSchema.js');

const validateReviewSchema = (err,req,res,next) =>{
    let joiResult =  reviewSchema.validate(req.body);
    console.log(joiResult);
    if(joiResult.err) throw ExError("408","Error in listing Schema when inserting the data:");
    else{
        next();
    }
}




router.post("/", validateReviewSchema,async (req, res, next) => {
    console.log("adding review : ");
    try{
     const listing = await Listing.findById(req.params.id);
     console.log(req.body.review);
     const d = req.body.review;
    const r1 = new Reviews(d) ;
    listing.reviews.push(r1);
    await r1.save();
    await listing.save();
    console.log("review added :")
    const path = "/listings/" + req.params.id;
    console.log(path);
    res.redirect(path);
    }catch(err){
 
         console.log("error in review adding : ",err);
         return next();
    }
    
 });
 
 
 router.get("/:revid", async(req,res)=>{
     const {listId,revid} = req.params;
     await Reviews.findByIdAndDelete(revid);
     await Listing.findByIdAndUpdate(listId,{$pull :{reviews : revid}});
     console.log("done deleeted : ");
     // const path = '/listings'
     res.redirect(`/listings/${listId}`);
 })
 

 module.exports = router;