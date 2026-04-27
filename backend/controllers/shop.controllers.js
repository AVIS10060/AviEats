import Shop from "../models/shop.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { sendResponse } from "../utils/response.js"

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    if (!name || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let image = "";

    // ✅ SAFE IMAGE UPLOAD (with timeout protection)
    if (req.file) {
      try {
        const uploadPromise = uploadOnCloudinary(req.file.path);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Image upload timeout")), 5000)
        );

        const result = await Promise.race([uploadPromise, timeoutPromise]);

        image = result?.secure_url || result || "";
      } catch (err) {
        console.log("Cloudinary Error:", err.message);

        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    // ✅ FIND EXISTING SHOP
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // ✅ CREATE
      shop = await Shop.create({
        name,
        city,
        address,
        state,
        image,
        owner: req.userId,
      });
    } else {
      // ✅ UPDATE (only update image if provided)
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          address,
          state,
          ...(image && { image }), // ✅ don't overwrite with undefined
        },
        { new: true }
      );
    }

    // ✅ SAFE POPULATE
    await shop.populate("owner items");

    return res.status(201).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.error("CREATE SHOP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } }
    ]);

    return res.status(200).json({
      success: true,
      shop: shop || null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    // ❗ validate input
    if (!city || city === "null" || city === "undefined") {
      return res.status(400).json({ message: "City is required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`${city}$`, "i") }
    }).populate("items");

    

    // ❗ correct check
    if (!shops) {
      return res.status(404).json({ message: "No shops found" });
    }

    return res.status(200).json(shops);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

