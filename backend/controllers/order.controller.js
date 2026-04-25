import DeliveryAssignment from "../models/delivery.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import { sendResponse } from "../utils/response.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  console.log(process.env.RAZORPAY_KEY_ID);
  console.log(process.env.RAZORPAY_KEY_SECRET);

  // ⏱ Kill the request after 15s no matter what
  req.setTimeout(15000, () => {
    if (!res.headersSent) {
      return res.status(503).json({
        success: false,
        message: "Request timed out. Please try again.",
      });
    }
  });
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
      }),
    );

    console.log("STEP 13: All shopOrders created", shopOrders);

    console.log("STEP 14: Creating order in DB");

    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount) * 100,
        currency: "INR",
        receipt: `reciept_${Date.now()}`,
      });
      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        totalAmount,
        shopOrders,
        deliveryAddress,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });
      return res.status(201).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      totalAmount,
      shopOrders,
      deliveryAddress,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.owner", "socketId");
    await newOrder.populate("user", "name email mobile");

    console.log("STEP 15: Order created successfully", newOrder);

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder?.owner?.socketId;

        console.log("EMITTING TO:", ownerSocketId);

        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            deliveryAddress: newOrder.deliveryAddress,
            shopOrders: [shopOrder],
            createdAt: newOrder.createdAt,
            payment: newOrder.payment,
          });
        } else {
          console.log("❌ No socketId for owner");
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status !== "captured") {
      return sendResponse(res, 400, "payment not captured");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return sendResponse(res, 400, "order not found");
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.owner", "name socketId");
    await order.populate("user", "name email mobile");

    console.log("STEP 15: Order created successfully", order);

    const io = req.app.get("io");

    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            deliveryAddress: order.deliveryAddress,

            shopOrders: [shopOrder],
            createdAt: order.createdAt,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "_id")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");
      return res.status(200).json(orders);
    }
    if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.shop", "_id")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrder = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        deliveryAddress: order.deliveryAddress,

        shopOrders: order.shopOrders.filter(
          (o) => o.owner?._id?.toString() == req.userId,
        ),
        createdAt: order.createdAt,
        payment: order.payment,
      }));

      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return sendResponse(res, 400, error);
  }
};

export const updateOrderStatus = async (req, res) => {
  console.log("API HIT", Date.now());
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => String(o.shop) === String(shopId),
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    // ✅ Update status
    shopOrder.status = status;

    let deliveryBoyPayload = [];

    // ✅ MAIN LOGIC
    if (status === "out for delivery") {
      const { longitude, latitude } = order.deliveryAddress;

      // 🔴 Validate coordinates
      if (!longitude || !latitude) {
        return res.status(400).json({
          message: "Invalid delivery coordinates",
        });
      }

      // ✅ ALWAYS fetch nearby delivery boys
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)], // [lon, lat]
            },
            $maxDistance: 5000,
          },
        },
      });

      // ✅ Extract IDs
      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      // ✅ Find busy boys
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      // ✅ Filter available boys
      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );

      // ✅ Map payload (safe)
      deliveryBoyPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location?.coordinates?.[0] || null,
        latitude: b.location?.coordinates?.[1] || null,
        mobile: b.mobile,
      }));

    

      // ✅ Create assignment ONLY ONCE
      if (!shopOrder.assignment && availableBoys.length > 0) {
        const deliveryAssignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopOrder.shop,
          shopOrderId: shopOrder._id,
          broadcastedTo: availableBoys.map((b) => b._id),
          status: "broadcasted",
        });

        shopOrder.assignment = deliveryAssignment._id;

        await deliveryAssignment.populate('order')
        await deliveryAssignment.populate('shop')

        const io = req.app.get("io");
        if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("new-assignment", {
              sentTo:boy?._id,
              assignmentId: deliveryAssignment?._id,
              orderId: deliveryAssignment?.order?._id,
              shopName: deliveryAssignment?.shop.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find((so) => so._id.equals(deliveryAssignment.shopOrderId))
                  .shopOrderItems || [],
              subTotal: deliveryAssignment.order.shopOrders.find((so) =>
                so._id.equals(deliveryAssignment.shopOrderId),
              )?.subTotal,
            });
          }
        });
      }
    }





      }
     


        

    // ✅ Save order
    await order.save();

    const updatedShopOrder = order.shopOrders.find(
      (o) => String(o.shop) === String(shopId),
    );

    // ✅ Populate
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");

    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop?._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy || null,
      availableBoys: deliveryBoyPayload,
      assignment: updatedShopOrder?.assignment || null,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assgnments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formatedData = assgnments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItems || [],
      subTotal: a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
        ?.subTotal,
    }));

    return res.status(200).json(formatedData);
  } catch (error) {
    return sendResponse(res, 500, "this is error");
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.userId;

    // 🔹 Get assignment
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }

    if (assignment.status !== "broadcasted") {
      return res.status(400).json({ message: "assignment expired" });
    }

    // 🔹 Check if delivery boy already has active order
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: "you are already assigned to another order",
      });
    }

    // 🔹 Assign delivery boy
    assignment.assignedTo = userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();

    // 🔹 Get order
    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    // 🔹 Find correct shopOrder
    const shopOrder = order.shopOrders.find((so) =>
      so._id.equals(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "shopOrder not found" });
    }

    // 🔹 Assign delivery boy to shopOrder
    shopOrder.assignedDeliveryBoy = userId;

    // 🔹 Save order
    await order.save();

    // 🔹 Populate AFTER save
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );

    return res.status(200).json({
      message: "order accepted",
      assignedDeliveryBoy: shopOrder.assignedDeliveryBoy,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location mobile" }],
      });

    if (!assignment) {
      return sendResponse(res, 400, "assignment not found");
    }

    if (!assignment.order) {
      return sendResponse(res, 400, "order not found");
    }

    // ✅ safer find
    const shoporder = assignment.order.shopOrders.find(
      (so) => String(so._id) === String(assignment.shopOrderId),
    );

    if (!shoporder) {
      return sendResponse(res, 400, "shopOrder not found");
    }

    // ✅ declare outside
    let deliveryBoyLocation = { lat: null, lon: null };
    let customerLocation = { lat: null, lon: null };

    // ✅ fix delivery boy location
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    // ✅ fix customer location
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude || null;
      customerLocation.lon = assignment.order.deliveryAddress.longitude || null;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shoporder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return sendResponse(res, 400, error.message || error);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return sendResponse(res, 400, "order not found ");
    }
    return res.status(200).json(order);
  } catch (error) {
    return sendResponse(res, 500, "internal server error");
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return sendResponse(res, 400, "enter valid order");
    }

    const otp = Math.floor(1000 + Math.random() * 900000).toString();

    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
    await order.save();

    await sendDeliveryOtpMail(order.user, otp);

    return sendResponse(
      res,
      200,
      `otp sent successfully to ${order.user?.fullName}`,
    );
  } catch (error) {
    return sendResponse(res, 500, "internal server error");
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId).populate("user");

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return sendResponse(res, 400, "enter valid order ");
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return sendResponse(res, 400, "Otp is Invalid or expired");
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();
    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({ message: "order delivered successfully" });
  } catch (error) {
    return sendResponse(res, 500, "internal server error");
  }
};
