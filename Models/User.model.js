const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profession:{type:String,required:true},
    salary:{type:Number,required:true},
    role:{type:String,enum:['User','Moderator'],default:"User",required:true}

})

const usermodel = mongoose.model("user",userSchema);

module.exports = {usermodel}