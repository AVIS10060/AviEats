import React from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../../redux/userSlice";

const CartItemCard = ({ item }) => {

  const dispatch = useDispatch()

  const increase = () => {

    dispatch(updateQuantity({
      id: item.id,
      quantity: item.quantity + 1
    }))

  }

  const decrease = () => {

    if (item.quantity > 1) {

      dispatch(updateQuantity({
        id: item.id,
        quantity: item.quantity - 1
      }))

    }

  }

  const total = item.price * item.quantity

  return (

    <div className="flex items-center justify-between border rounded-xl p-4 hover:shadow-sm transition">

      {/* Left side */}

      <div className="flex items-center gap-4">

        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-md object-cover"
        />

        <div>

          <h3 className="font-semibold">
            {item.name}
          </h3>

          <p className="text-sm text-gray-500">
            ₹{item.price} x {item.quantity}
          </p>

          <p className="font-semibold">
            ₹{total}
          </p>

        </div>

      </div>


      {/* Right side controls */}

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3 border rounded-full px-3 py-1">

          <button
            onClick={decrease}
            className="text-lg font-semibold"
          >
            -
          </button>

          <span>
            {item.quantity}
          </span>

          <button
            onClick={increase}
            className="text-lg font-semibold"
          >
            +
          </button>

        </div>

        <button className="text-red-500 hover:text-red-600">
          <FaTrash/>
        </button>

      </div>

    </div>

  )
}

export default CartItemCard