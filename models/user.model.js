import mongoose, { mongo, Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required:true
    },
    email : {
        type:String,
        requried:true,
        unique:true
        
    },

    password : {
        type:String,
        
        
    },
    mobile:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["owner","user","deliveryBoy"],
        required:true

    }



},{timestamps:true

})

const User = mongoose.model("User",userSchema)