import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendResponse } from "../utils/response.js";

export const placeOrder = async (req, res) => {
  // ⏱ Kill the request after 15s no matter what
  req.setTimeout(15000, () => {
    if (!res.headersSent) {
      return res.status(503).json({
        success: false,
        message: "Request timed out. Please try again."
      })
    }
  })
  try {
    console.log("STEP 1: Request received");
    
    const { cartItems, paymentMethod, totalAmount, deliveryAddress } = req.body;

    console.log("STEP 2: Body parsed", {
      cartItemsLength: cartItems?.length,
      paymentMethod,
      totalAmount,
      deliveryAddress,
    });

    // ✅ Validate cartItems
    if (!cartItems || cartItems.length === 0) {
      console.log("STEP 2A: cartItems missing");
      return sendResponse(res, 400, "cartItems not found");
    }

    // ✅ Validate deliveryAddress safely
    if (
      !deliveryAddress ||
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      console.log("STEP 2B: deliveryAddress invalid", deliveryAddress);
      return sendResponse(res, 400, "delivery address incomplete");
    }

    console.log("STEP 3: Starting grouping by shop");

    const groupByItemsByShop = {};
    cartItems.forEach((item, index) => {
      console.log(`STEP 3.${index}: Processing item`, item);

      const shopId = item.shop;

      if (!shopId) {
        console.log("STEP 3 ERROR: Missing shopId in item", item);
        throw new Error("Invalid shopId in cartItems");
      }

      if (!groupByItemsByShop[shopId]) {
        groupByItemsByShop[shopId] = [];
      }

      groupByItemsByShop[shopId].push(item);
    });

    console.log("STEP 4: Grouping complete", groupByItemsByShop);

    const shopIds = Object.keys(groupByItemsByShop);
    console.log("STEP 5: Shop IDs extracted", shopIds);

    const shopOrders = await Promise.all(
      shopIds.map(async (shopId, index) => {
        console.log(`STEP 6.${index}: Processing shopId`, shopId);

        if (!shopId) {
          console.log("STEP 6 ERROR: Invalid shopId");
          throw new Error("Invalid shopId");
        }

        console.log(`STEP 7.${index}: Fetching shop from DB`);

        const shop = await Shop.findById(shopId).populate("owner");

        console.log(`STEP 8.${index}: Shop fetched`, shop);

        if (!shop) {
          console.log(`STEP 8 ERROR: Shop not found for ${shopId}`);
          throw new Error("Shop not found");
        }

        if (!shop.owner) {
          console.log(`STEP 8 ERROR: Owner missing for ${shopId}`);
          throw new Error(`Owner missing for shop ${shopId}`);
        }

        const items = groupByItemsByShop[shopId];
        console.log(`STEP 9.${index}: Items for shop`, items);

        const subTotal = items.reduce((sum, i) => {
          const value = Number(i.price) * Number(i.quantity);
          console.log(`STEP 10.${index}: Calculating item total`, {
            price: i.price,
            quantity: i.quantity,
            value,
          });
          return sum + value;
        }, 0);

        console.log(`STEP 11.${index}: subTotal calculated`, subTotal);

        const formattedItems = items.map((i, idx) => {
          console.log(`STEP 12.${index}.${idx}: Formatting item`, i);
          return {
            item: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          };
        });

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: formattedItems,
        };
      })
    );

    console.log("STEP 13: All shopOrders created", shopOrders);

    console.log("STEP 14: Creating order in DB");

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      totalAmount,
      shopOrders,
      deliveryAddress
    });
    // await newOrder.populate("shopOrders.shopOrderItems.item","name image price")
    // await newOrder.populate("shopOrders.shop","name")

    console.log("STEP 15: Order created successfully", newOrder);

    return res.status(201).json(newOrder);

  } catch (error) {
    console.error("❌ ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyOrders = async(req,res) =>{
  try {
    const user = await User.findById(req.userId)
    if(user.role == "user"){
       const orders = await Order.find({user:req.userId}).sort({createdAt:-1}).populate("shopOrders.shop","_id").populate("shopOrders.owner","name email mobile").populate("shopOrders.shopOrderItems.item","name image price")
    return res.status(200).json(orders)

    }
    if(user.role == "owner"){
       const orders = await Order.find({"shopOrders.owner":req.userId}).sort({createdAt:-1}).populate("user").populate("shopOrders.owner","name email mobile").populate("shopOrders.shopOrderItems.item","name image price").populate("shopOrders.shop","_id")

      const filteredOrder = orders.map(order => ({
  _id: order._id,
  paymentMethod: order.paymentMethod,
  user: order.user,

  shopOrders: order.shopOrders.filter(
    o => o.owner._id.toString() === req.userId
  ),
  createdAt:order.createdAt
}));



    return res.status(200).json(filteredOrder)
    } 
  } catch (error) {
    return sendResponse(res,400,error)
    
  }
}


export const updateOrderStatus = async(req,res) =>{
  try {
    const {orderId,shopId} = req.params 
    const {status} = req.body
    const order = await Order.findById(orderId)

    const shopOrder =order.shopOrders.find(o=>o.shop== shopId)

    if(!shopOrder){
      return sendResponse(res,400,"shop order not found")
    }
    shopOrder.status = status
    // await shopOrder.save()
    await order.save()
    // await shopOrder.populate("shopOrderItems.item","name image price")
    return res.status(200).json(shopOrder.status)
    
  } catch (error) {
    return console.log(error)
    
  }
}




