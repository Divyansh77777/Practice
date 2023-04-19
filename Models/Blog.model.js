const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({

    user_id:{type:String,required:true},
    type:{type:String,enum:['deposit','withdraw'],default:"deposit",required:true},
    amount:{type:Number,required:true},
    
})

const blogmodel = mongoose.model("transactions",blogSchema);

module.exports = {blogmodel}