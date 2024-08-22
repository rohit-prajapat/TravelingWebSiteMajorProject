const mongoose = require("mongoose");
let data = require("./data");
const Listing = require('../Model/Listing');
const MongoURL = 'mongodb://127.0.0.1:27017/TSMajorPro';

const main = async() =>{
    await mongoose.connect(MongoURL);
}


main().then(()=>{
    console.log("connected : ");
}).catch((err)=>{
    console.log(err);
});


const initDB = async () =>{
    Listing.deleteMany({}).then((r)=>{
        console.log(r);
    });
    
    data = data.data.map((Obj)=> ({...Obj,owner :"66c49f6630dab3f7b2b0ab3d"}));

    // console.log(data);
    await Listing.insertMany(data).then((res)=>{
        console.log("Data is saved: ");
        console.log(res);
    });
}

initDB();


