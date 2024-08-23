express = require('express');


//-----------------------------

const Listing = require("../Model/Listing");
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExError = require("../Errorhandling/errorclass");
const{ listingSchema} = require("../listingSchema.js");
const Reviews = require('../Model/review'); // Import the Reviews model
const {reviewSchema} = require('../ReviewSchema.js');
const listings = require('../Routers/listing');
const { route } = require('./User');
const router = require('./User');
const passport = require('passport');
const flash = require('flash');
const isLogin = require('../midleware/isLogIn');
const {storage} = require("../cloudConfig");
const multer  = require('multer');
const upload = multer({storage});



//-------------------------------------------

console.log("lisinging");



router.get("/",(req,res,next)=>{

    
    
    console.log("send listing request");

    
    Listing.find().then((data)=>{
        if(data != null)
        
        res.render("AllList.ejs",{data});
       

    }).catch((err)=>{
        res.send(err);
        console.log("error is listing page: ");
        return next();
    });
    
    
    
})
router.get("/new",isLogin,(req,res)=>{
    
    
    // flash("success ","authentiaate : ");
   return res.render("addnewplace");
  
})

const validateLisingSchema = (err,req,res,next) =>{
    let joiResult =  listingSchema.validate(req.body);
    console.log(joiResult);
    if(joiResult.err) throw ExError("408","Error in listing Schema when inserting the data:");
    else{
        next();
    }
}

router.post("/",isLogin,upload.single('image'),(req,res,next)=>{

   
    try{
        console.log("add new place , post request : ");
        let listing = req.body;
       
        let filename = req.file.fieldname;
        let url = req.file.path;
        listing.image = {
            filename: filename,
            url: url
        };
        
        console.log(listing);
        let newlisting ={...listing,owner :"66c49f6630dab3f7b2b0ab3d"};

        let newlist = new Listing(newlisting);
        console.log(newlist);
        newlist.save();
        console.log("Data saved");
        // req.flash("success","new Listed created : ");
        res.redirect("/listings");
        
    }catch(err){
        console.log("error is listing page: ");
        console.log("error is saving data",err);
        // throw new ExError("404","data is not saved : error in schema : ");
        res.send(err);
    }  
    
})

router.post("/:id/delet",isLogin,async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!req.user || !req.user._id.equals(list.owner._id))
    {
        return res.send('only owner can edit post ');
    }
    Listing.findByIdAndDelete(id).then((x)=>{
        console.log("Deleted :",x);
    }).catch((e)=>{
        console.log("error in deleting ",e);
        return next();
    })

    res.redirect("/listings");
})
router.get("/:id/edit",isLogin,(req,res,next)=>{
    let id = req.params.id;
    console.log(id);
    
    Listing.findById(id).then((list)=>{
        console.log(list);
        res.render("updateDetails",{list});
    }).catch(()=>{
        console.log("error is edit page: ");
        res.send("this page dones not exist : ");
        return next();
    });

})
router.get("/:id", isLogin,async(req,res,next)=>{
    console.log("One data: ");
    let id = req.params.id;
    console.log(id);
    await Listing.findById(id).populate({path :"reviews",
        populate :{
            path : "author",
        }
    }).populate("owner").then((data)=>{
        
        res.render("locationByid",{data});
    }).catch((err)=>{
        console.log(err);
        console.log("eroor is data fetching:");
        return next();
    });
})

router.post("/:id/update", isLogin,async (req, res,next) => {
  
    let id = req.params.id;
    
    console.log("Update list",id);
    let list = await Listing.findById(id);
    console.log(req.user.id,list.owner);
    if(!req.user || !req.user._id.equals(list.owner._id))
    {
        return res.send('only owner can edit post ');
    }

    let updatedListing = req.body;
  
    console.log("Updated list is here : ",updatedListing)
    Listing.findByIdAndUpdate(id, updatedListing, { new: true,runValidators: true })
        .then((list) => {

            // console.log(list);
            res.redirect("/listings/"+id);
        })
        .catch((err) => {
            console.error(err);
            console.log("error in data update :")
            res.status(500).send("Error updating listing");
            return next();
        }); 
});

router.post("/send-email",(req,res)=>{
    console.log("recived :");
    res.redirect("/listings");
})




// router.use("/listings/:id/reviews",)


module.exports = router;