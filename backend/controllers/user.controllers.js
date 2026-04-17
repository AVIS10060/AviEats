
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


export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    // Validation
    if (
      lat === undefined ||
      lon === undefined ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      return res.status(400).json({
        message: "Invalid latitude or longitude",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat], // ✅ CORRECT ORDER
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Update location error: ${error.message}`,
    });
  }
};