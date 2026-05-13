import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";
import { sendResponse } from "../utils/response.js";


// this is a comment 
// this is 2nd comment
// this is 3rd comment 

// ================= SIGN UP =================
export const signUp = async (req, res)=>{
  try {
    const { fullName, email, password, role, mobile } = req.body;

    let user = await User.findOne({ email });
    console.log(user);

    if (user) {
      return sendResponse(res, 400, "user already exists");
    }

    if (password.length < 4) {
      return sendResponse(res, 400, "Password must be atleast 4 characters ");
    }

    if (mobile.length !== 10) {
      return sendResponse(
        res,
        400,
        "mobile number  must be atleast 10 digits .",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return sendResponse(res, 201, "User created successfully", user);
  } catch (error) {
    return sendResponse(res, 500, `signup ${error}`);
  }
};

// ================= SIGN IN =================

export const signIn = async (req, res)=>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 400, "user does not exist ");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return sendResponse(res, 400, "incorrect password ");
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
     secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return sendResponse(res, 200, "Login successful", user);

  } catch (error) {
    return sendResponse(res, 500, `signin ${error}`);
  }
};


// ================= SIGN OUT =================
export const signOut = (req, res)=>{
  try {
    res.clearCookie("token");
    return sendResponse(res, 200, "Logged out successfully!!");
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

// ================= SEND OTP =================
export const sendOtp = async (req, res)=>{
  try {
    const { email } = req.body;
    

    const user = await User.findOne({ email });
    

    if (!user) {
      return sendResponse(res, 400, "user doest not exist with this email");
    }

    const otp = Math.floor(1000 + Math.random() * 900000).toString();
    
    console.log(otp)

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendOtpMail(email,otp);

    return sendResponse(res, 200, "otp sent successfully");
  } catch (error) {
    return sendResponse(res, 500, `Otp ${error}`);
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res)=>{
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return sendResponse(res, 400, "invalid/expired otp");
    }

    user.resetOtp = undefined;
    user.isOtpVerified = true;

    await user.save();

    return sendResponse(res, 200, "otp verified successfully");
  } catch (error) {
    return sendResponse(res, 400, `verify otp ${error}`);
  }
};

export const resetPassword = async(req,res)=>{
    try {
        const {email,newPassword} = req.body
        const user = await User.findOne({email})
         if (!user || !user.isOtpVerified) {
      return sendResponse(res, 400, "otp verification required");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword,10)
    user.password = hashedPassword
    user.isOtpVerified = false  
    console.log(user)      
    await user.save()
    return sendResponse(res, 200, "Password Reset Successfully");

    } catch (error) {
        return sendResponse(res, 500, `${error}`);
        
    }
}


export const googleAuth = async (req,res) =>{
    try {
        const {fullName,email,mobile,role} = req.body

        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                fullName,email,mobile,role
            })
        }

        const token = await genToken(user._id)
        res.cookie("token",token,{
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
        })

        return res.status(200).json(user)


        
    } catch (error) {
        return sendResponse(res,200,error)
        
        
    }
}
