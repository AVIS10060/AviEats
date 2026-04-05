import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { addMyOrder } from "../../redux/userSlice";

const OrderPaymentSummary = ({
  address,lat,lon
}) => {
  const dispatch = useDispatch()


    const {cartItems,totalAmount} = useSelector(state=>state.user)
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate()

  const deliveryFee = totalAmount>500 ? 0 : 40



   const handlePlaceOrder = async()=>{
    try {
        const result = await axios.post(`${serverUrl}/api/order/place-order`,{
            paymentMethod,
            totalAmount,
            cartItems,
            deliveryAddress:{
              text:address,
              latitude:lat,
              longitude: lon
            }
        },{withCredentials:true,})
      dispatch(addMyOrder(result.data))
     
     navigate("/order-placed")
        
    } catch (error) {
        return console.log(error)
    }

  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Payment Method */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

        <div className="flex gap-4 flex-col sm:flex-row">

          {/* COD */}
          <div
            onClick={() => setPaymentMethod("cod")}
            className={`flex-1 p-4 rounded-lg cursor-pointer border-2 ${
              paymentMethod === "cod"
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>💵</span>
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>
          </div>

          {/* ONLINE */}
          <div
            onClick={() => setPaymentMethod("online")}
            className={`flex-1 p-4 rounded-lg cursor-pointer border-2 ${
              paymentMethod === "online"
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>📱</span>
              <div>
                <p className="font-medium">UPI / Credit / Debit Card</p>
                <p className="text-sm text-gray-500">
                  Pay securely online
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm">

          {/* Items */}
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "free" : "₹"+deliveryFee}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-orange-500">₹{totalAmount + deliveryFee}</span>
          </div>

        </div>
      </div>

      {/* Place Order */}
      <div className="mt-6">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg"
        >
          {paymentMethod == "cod" ? "place Order" : "pay and place order"}
        </button>
      </div>

    </div>
  );
};

export default OrderPaymentSummary;