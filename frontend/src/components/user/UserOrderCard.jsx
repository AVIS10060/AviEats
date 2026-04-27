import React from "react";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate()
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border">
      
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="font-semibold text-gray-800">
            Order #{data._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">

          {data.paymentMethod.toUpperCase() === "cod" ?  (  <p className="text-sm font-medium text-gray-700">
            {data.paymentMethod.toUpperCase()}
          </p>):( <p className="text-sm font-medium text-gray-700">
            Payment {data.payment ? "Paid" : "failed"}
          </p>)}


         
          <p className="text-blue-500 text-sm capitalize">
            {data.shopOrders?.[0]?.status || "pending"}
          </p>
        </div>
      </div>

      <hr className="my-3" />

      {/* 🔹 Shop Orders */}
      {data.shopOrders.map((shopOrder, index) => (
        <div key={index} className="mb-4">

          {/* Shop Name */}
          <h3 className="font-medium text-gray-700 mb-2">
            {shopOrder.shop?.name}
          </h3>

          {/* Items */}
          <div className="flex flex-wrap gap-3">
            {shopOrder.shopOrderItems.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg p-2 w-[130px] shadow-sm"
              >
                <img
                  src={item.item?.image}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-md mb-1"
                />

                <p className="text-sm font-medium text-gray-800">
                  {item.name}
                </p>

                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} x ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="font-medium text-gray-700">
              Subtotal: ₹{shopOrder.subTotal}
            </p>
            <p className="text-blue-500 capitalize">
              {shopOrder.status}
            </p>
          </div>

          <hr className="mt-3" />
        </div>
      ))}

      {/* 🔹 Total */}
      <div className="flex justify-between items-center mt-3">
        <p className="font-semibold text-gray-800">
          Total: ₹{data.totalAmount}
        </p>

        <button onClick={()=>navigate(`/track-order/${data._id}`)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md text-sm">
          Track Order
        </button>
      </div>
    </div>
  )
};

export default UserOrderCard;