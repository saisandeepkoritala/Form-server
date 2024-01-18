const mongoose = require("mongoose");
const validator = require("validator");

const tempUser = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name not Provided"]
    },
    email:{
        type:String,
        required:[true,"Email not Provided"],
        unique:true,
        validate:[validator.isEmail,"Please Provide a valid email"]
    },
    code:{
        type:String,
        required:[true,"Need an Code"]
    },
    expiresIn:{
        type:Date
    }
})

const TempUser = mongoose.model("tempUser",tempUser)

module.exports = TempUser;