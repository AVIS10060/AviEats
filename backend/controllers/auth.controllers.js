import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"


export const signUp = async(req,res)=>{

    try {
        const {fullName,email,password,role,mobile} = req.body


        let user = await User.findOne({email})
        console.log(user)

        if(user) {
            return res.status(400).json({"message": "user already exists"})
        }

        if(password.length<4){
            return res.status(400).json({"message": "Password must be atleast 4 characters "})
        }
        if(mobile.length !== 10){
            return res.status(400).json({"message": "mobile number  must be atleast 10 digits ."})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password:hashedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7* 24 * 60 * 60 * 1000,
            httpOnly:true
        })

        return res.status(201).json(user)



       
    } catch (error) {
        return res.status(500).json({"message" : `signup ${error}`})
        
    }

}

export const signIn = async(req,res)=>{

    try {
        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({"message": "user does not exist "})
        }
        
        const isMatched = await bcrypt.compare(password,user.password)

        if(!isMatched){
            return res.status(400).json({ message:"incorrect password "})
        }

        const token = await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7* 24 * 60 * 60 * 1000,
            httpOnly:true
        })

        return res.status(200).json(user)
       
    } catch (error) {
        return res.status(500).json({"message" : `signin ${error}`})
        
    }

}


export const signOut = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}