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

    },
    resetOtp:{
        type:String,

    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // FIXED (capital P)
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  
    
},{timestamps:true

})

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User",userSchema)

export default User