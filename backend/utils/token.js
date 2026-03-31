import JWT from 'jsonwebtoken'

const genToken = async (userId) =>{
    try {
        const token =await JWT.sign(
            { userId: String(userId) }
            ,process.env.JWT_SECRET,{expiresIn:"7d"})
         console.log("UserId received in genToken:", userId);
        return token 
    } catch (error) {
        console.log(error)
        
    }


}

export default genToken