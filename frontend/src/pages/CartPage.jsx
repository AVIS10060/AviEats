import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/user/CartItemCard";

const CartPage = () => {

  const navigate = useNavigate()

  const { cartItems ,totalAmount} = useSelector(state => state.user)

 

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">

      {/* Inner container */}

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">

        {/* Header */}

        <div className="relative mb-8">

          {/* Back Button */}

          <button
            onClick={() => navigate("/")}
            className="absolute left-0 text-blue-600 text-sm hover:underline"
          >
            ← Back
          </button>

          {/* Title */}

          <h1 className="text-center text-xl font-semibold">
            Your Cart
          </h1>

        </div>


        {/* Cart Items */}

        {cartItems.length === 0 ? (

          <div className="text-center text-gray-500 py-10">
            Your cart is empty
          </div>

        ) : (

          <div className="flex flex-col gap-6">

            {cartItems.map(item => (
              <CartItemCard key={item.id} item={item}/>
            ))}

          </div>

        )}


        {/* Total Section */}

        {cartItems.length > 0 && (

          <div className="mt-10 flex flex-col gap-4">

            <div className="flex justify-between border rounded-lg px-4 py-3 text-lg font-medium">

              <span>Total Amount</span>

              <span className="text-orange-500 font-semibold">
                ₹{totalAmount}
              </span>

            </div>

            <button
            onClick={()=>navigate("/checkout")}
             className="bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-medium">

              Proceed to Checkout

            </button>

          </div>

        )}

      </div>

    </div>

  )
}

export default CartPage