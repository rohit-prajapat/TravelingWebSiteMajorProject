const express = require("express");
const Listing = require("./Model/Listing");
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExError = require("./Errorhandling/errorclass");
const{ listingSchema} = require("./listingSchema.js");
//-------------------------------
const app = express();
//----------------------------------
const path = require("path");
//--------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', engine);
//----------------------------------
const mongoose = require('mongoose');
const URL = 'mongodb://127.0.0.1:27017/TSMajorPro';
const main = async ()=>{
    await mongoose.connect(URL);
}
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("Error in connection with DB");
    
})

// /------------------------

app.get("/",(req,res)=>{
    console.log("home");
    throw new ExError("404","home page not ready : ");
    res.send("Home:");
})

app.get("/listings",(req,res,next)=>{
    console.log("send listing request");
    
    Listing.find().then((data)=>{
        if(data != null)
        
        res.render("AllList.ejs",{data});

    }).catch(()=>{
        console.log("error is listing page: ");
        return next();
    });
    
    
    
})
app.get("/listings/new",(req,res)=>{
    
    res.render("addnewplace");
  
})

const validateLisingSchema = (err,req,res,next) =>{
    let joiResult =  listingSchema.validate(listing);
    console.log(joiResult);
    if(joiResult.err) throw ExError("408","Error in listing Schema when inserting the data:");
    else{
        next();
    }
}

app.post("/listings",validateLisingSchema,(req,res,next)=>{

    let {listing} = req.body;

    
    try{
        
        const newlist = new Listing(listing);
        newlist.save();
        console.log("Data saved");
        res.redirect("/listings");
    }catch(err){
        console.log("error is listing page: ");
        console.log("error is saving data",e);
        throw ExError("404","data is not saved : error in schema : ");
    }  
    
})

app.post("/listings/:id/delet",(req,res,next)=>{
    let {id} = req.params;
    Listing.findByIdAndDelete(id).then((x)=>{
        console.log("Deleted :",x);
    }).catch((e)=>{
        console.log("error in deleting ",e);
        return next();
    })

    res.redirect("/listings");
})
app.get("/listings/:id/edit",(req,res,next)=>{
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
app.get("/listings/:id", async(req,res,next)=>{
    console.log("One data: ");
    let id = req.params.id;
    console.log(id);
    await Listing.findById(id).then((data)=>{
        console.log(data);
        res.render("locationByid",{data});
    }).catch((err)=>{
        console.log(err);
        console.log("eroor is data fetching:");
        return next();
    });
})

app.post("/listings/:id/update", (req, res,next) => {
    let id = req.params.id;
    let updatedListing = req.body.listing;

    Listing.findByIdAndUpdate(id, updatedListing, { new: true,runValidators: true })
        .then((list) => {
            res.redirect("/listings");
        })
        .catch((err) => {
            console.error(err);
            console.log("error in data update :")
            res.status(500).send("Error updating listing");
            return next();
        });
});

app.post("/send-email",(req,res)=>{
    console.log("recived :");
    res.redirect("/listings");
})

app.use((err,req,res,next)=>{
    console.log(err.status,err.message);
    res.render("Error.ejs",{err});
})

const port = 8081;
app.listen(port,(req,res)=>{
    console.log("Server Started: ");
})
