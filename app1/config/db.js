const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect= async ()=>{

try{

   await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

}catch(err){
    console.log("Cannot connected to Database");
    process.exit(1);
}

}

module.exports=dbConnect;