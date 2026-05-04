import { sendResponse } from "../utils/response.js"
import JWT from 'jsonwebtoken'

const isAuth = async (req,res,next) =>{
    try {
        const token = req.cookies.token
        
        if(!token){
            return sendResponse(res,400,"signin failed no user found")
        }
        const decodeToken = JWT.verify(token,process.env.JWT_SECRET)
        // console.log(decodeToken)

        if(!decodeToken){
            return sendResponse(res,400,"user not Found")
        }
        const id = decodeToken.userId
        req.userId = id
        next()
        
    } catch (error) {
        return sendResponse(res,400,error)
        
    }
    
}

// this is auth 

// this is 1st comment 

export default isAuth