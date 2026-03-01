import User from "../models/user.model.js"
import { sendResponse } from "../utils/response.js"

export const getCurrrentUser = async(req,res) =>{
    try {
        const userId = req.userId
        console.log(userId)
        if (!userId){
            return sendResponse(res,400,"userId not found")
        }
        const user = await User.findById(userId)
        if(!user){
            return sendResponse(res,400,"user not found")
        }

        return res.status(200).json(user)
        
    } catch (error) {
        return sendResponse(res,400,error)
        
    }
}