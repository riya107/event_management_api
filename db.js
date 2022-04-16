const mongoose=require("mongoose");

mongoose.connect(process.env.mongoadd).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});