import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMyOrder } from "../../redux/userSlice";
import toast from "react-hot-toast";
import api from "../../api/axios";

const OrderPaymentSummary = ({
  address,lat,lon
}) => {
  const dispatch = useDispatch()


    const {cartItems,totalAmount} = useSelector(state=>state.user)
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate()

  const deliveryFee = totalAmount>500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee



   const handlePlaceOrder = async()=>{
    try {
        const result = await api.post('/order/place-order',{
            paymentMethod,
            totalAmount:AmountWithDeliveryFee,
            cartItems,
            deliveryAddress:{
              text:address,
              latitude:lat,
              longitude: lon
            }
        })
     if(paymentMethod === "cod"){
       dispatch(addMyOrder(result.data))
       navigate("/order-placed")
     }else{
      const orderId = result.data.orderId
      const razorOrder = result.data.razorOrder
      openRazorpayWindow(orderId,razorOrder)
      navigate("/order-placed")
     
     }
        
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Unable to place order')
    }

  }

const openRazorpayWindow = (orderId, razorOrder) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: razorOrder.amount,
    currency: "INR",
    name: "AviEats",
    description: "Food Delivery",

    order_id: razorOrder.id,

    // 🔥 VERY IMPORTANT (enables UPI detection)
    prefill: {
      name: "Avi Sharma",
      email: "test@razorpay.com",
      contact: "9625328470", // REQUIRED for UPI
    },

    // 🔥 Force enable all methods (UPI included)
    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true,
    },

    // 🔥 Improve success UX
    theme: {
      color: "#f97316",
    },

    // 🔥 Handle success
    handler: async function (response) {
      try {
        const result = await api.post(
          '/order/verify-payment',
          {
            razorpay_payment_id: response.razorpay_payment_id,
            orderId,
          },
        )

        dispatch(addMyOrder(result.data))
        navigate("/order-placed")

      } catch (error) {
        console.log(error)
      }
    },

    // 🔥 Handle failure (you were missing this)
    modal: {
      ondismiss: function () {
        console.log("Payment popup closed")
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
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
          disabled={!cartItems || cartItems.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay and place order"}
        </button>
      </div>

    </div>
  );
};

export default OrderPaymentSummary;
