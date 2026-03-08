import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
    category: {
      type: String,
      enum: [
        "snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "chinese",
        "Fast Food",
        "others",
      ],
      required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    foodType:{
        type:String,
        enum:["veg","non veg"]
    }
  },
  { timestamps: true },
);

const Item = mongoose.model("Item",itemSchema)

export default Item


