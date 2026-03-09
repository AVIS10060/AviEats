import Item from "../models/item.model.js"
import Shop from "../models/shop.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { sendResponse } from "../utils/response.js"

export const createItem = async(req,res)=>{
    try {
        const {name,category,price,foodType} = req.body
        let image 
    if(req.file){
        image = await uploadOnCloudinary(req.file.path)
    }
    const shop = await Shop.findOne({owner:req.userId},{

    })
    if(!shop){
        return sendResponse(res,400,"shop not found")
    }
    const item = await Item.create({
        name,category,foodType,price,image,shop:shop._id
    })

    return res.status(200).json(item)
        
    } catch (error) {
        return sendResponse(res,400,"add item error")
        

        
    }

}



export const ediItem = async (req,res) =>{
    try {
        const itemId = req.params.itemId
        const {name,category,price,foodType} = req.body
        let image
        if(req.file){
        image = await uploadOnCloudinary(req.file.path)
    }
     const item = await Item.findByIdAndUpdate(itemId,{
        name,price,category,foodType,image
     },{new:true})
     if(!item){
        return sendResponse(res,400,"item not found")
     }
     return res.status(200).json(item)
    } catch (error) {
        return sendResponse(res,400,`added item error ${error}`)
        
    }
}