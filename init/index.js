const mongoose = require('mongoose');
const initData = require("./sampleListing.js")
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Database is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb+srv://sumitpandat284:LsAhop0hBYGHpNS6@cluster0.rbsmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

let initDB = async()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map(data=>{
    return {...data, owner: "67024e32ce67e5d956164d7d"}
   })
   await Listing.insertMany(initData.data)
   console.log("data initialised");
}
initDB();