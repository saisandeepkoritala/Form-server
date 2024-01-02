const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Needed"]
    },
    email:{
        type:String,
        required:[true,"Email is Needed"],
        unique:true,
        validate:[validator.isEmail,"Please Provide a valid email"]
    },
    password:{
        type:String,
        required:[true,"Password is Needed"],
        minlength:8,
        select:false
    }, 
    passwordConfirm:{
        type:String,
        required:[true,"Password Needs to be Confirmed"],
        minlength:8,
        validate:{
            validator:function(value){
                return this.password===value;
        },
        message:"Password Not Matched"
    }
    }
}) 

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword =async function(password,userPassword){
    return await bcrypt.compare(password,userPassword)
}

const User = mongoose.model("user",userSchema);

module.exports = User;