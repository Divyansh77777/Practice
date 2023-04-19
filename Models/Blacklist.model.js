const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({

    token:{type:String}

})

const blacklistmodel = mongoose.model("blacklist",blacklistSchema);

module.exports = {blacklistmodel}