import Shop from "../models/shop.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { sendResponse } from "../utils/response.js"

export const createEditShop = async(req,res) =>{
    try {
        const {name,city,state,address} = req.body
        let image
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
            
        }
        let shop = await Shop.findOne({owner:req.userId})

        if(!shop){
            shop = await Shop.create({
            name,
            city,
            address,
            image,
            state,
            owner:req.userId
        })
        

        }
        else{
            shop = await Shop.findByIdAndUpdate(shop._id,{
                name,address,state,image,owner:req.userId
            },{new:true})
        }
        
        await shop.populate("owner items")
        return res.status(201).json(shop)
        
    } catch (error) {
        return sendResponse(res,500,`create shop error ${error}`)
        
    }
}

export const getMyShop = async(req,res) =>{
    try {
       const shop = await Shop.findOne({ owner: req.userId }).populate([
  { path: "owner" },
  { path: "items", options: { sort: { updatedAt: -1 } } }
])
        if(!shop){
            return null
        }
        return res.status(200).json(shop)

        
    } catch (error) {
        return sendResponse(res,500,`${error} in getting shop`)
        
    }
}


export const getShopByCity = async(req,res) =>{
    try {
        const {city} = req.params
        const shops = await Shop.find({city:{$regex:new RegExp(`${city}$`,"i")}}).populate("items")

        if(!shops){
            return sendResponse(res,400,"shops not found ")
        }

        return res.status(200).json(shops)       
    } catch (error) {
        console.log(error)
        
    }
}

