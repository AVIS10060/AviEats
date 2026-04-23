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

    shop.items.push(item._id)
    await shop.save()
   await shop.populate("owner")
    await shop.populate({
  path: "items",
  options: { sort: { updatedAt: -1 } }
    })

    return res.status(200).json(shop)
        
    } catch (error) {
        return console.log(error)
        

        
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
     const shop = await Shop.findOne({owner:req.userId}).populate({
        path:"items",
        options:{sort:{updatedAt:-1}}
     })
     return res.status(200).json(shop)
    } catch (error) {
        return sendResponse(res,400,`added item error ${error}`)
        
    }
}

export const getItemById = async(req,res)=>{
    try {
        const { itemId } = req.params
        console.log(itemId)

        const item = await Item.findById(itemId)
        console.log(item)

        if(!item){
            return sendResponse(res,400,"item not found")
        }

        return res.status(201).json(item)
    } catch (error) {
        return console.log(error)
        
        
    }
}

export const deleteItem = async (req, res) => {
  try {

    const itemId = req.params.itemId

    const item = await Item.findByIdAndDelete(itemId)

    if (!item) {
      return sendResponse(res, 400, "item not found")
    }

    const shop = await Shop.findOne({ owner: req.userId })

    shop.items = shop.items.filter(
      (i) => i.toString() !== itemId
    )

    await shop.save()

    await shop.populate("items")

    return res.status(200).json(shop)

  } catch (error) {
    console.log(error)
    return sendResponse(res, 500, "server error")
  }
}

export const getItemByCity = async (req,res)=>{
    try {
        const { city } = req.params
        if(!city){
         return res.status(400).json({message:"city is required "})
        }
        const shops = await Shop.find({city:{$regex:new RegExp(`${city}$`,"i")}}).populate("items")

        const shopIds = shops.map((shop)=>shop._id)

        const items = await Item.find({shop:{$in:shopIds}})

        return res.status(200).json(items)
        
    } catch (error) {
        return console.log(error)
        
        
    }
}

export const getItemByShop = async(req,res) =>{
    try {
        const {shopId} = req.params 

        const shop = await Shop.findById(shopId).populate("items")

        if(!shop){
            sendResponse(res,400,"shop niddd found")

        }

        return res.status(200).json({
            shop,items:shop.items
        })
        
    } catch (error) {
        return sendResponse(res,500,"error")
        
    }
}


export const searchItems = async (req,res) =>{
    try {
        const {query,city} = req.query 

        if(!query || !city){

            return null
        }
        if(!city){
         return res.status(400).json({message:"city is required "})
        }
        const shops = await Shop.find({city:{$regex:new RegExp(`${city}$`,"i")}}).populate("items")

        if(!shops){
            return res.status(400).json({message:"shops not found"})
        }

        const shopIds = shops.map(i=> i._id)

        console.log(shopIds)

        const items = await Item.find({
            shop:{$in:shopIds},
            $or:[
                {name:{$regex:query,$options:"i"}},
                {category:{$regex:query,$options:"i"}}
            ]
        }).populate("shop", "name image")

        console.log(items)

        console.log("shopIds:", shopIds)
console.log("query:", query)

const testItems = await Item.find({ shop: { $in: shopIds } })
console.log("items without search:", testItems)


        return res.status(200).json(items)



    } catch (error) {
        return sendResponse(res,500,error)
        
    }
}