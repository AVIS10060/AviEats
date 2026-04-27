import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../redux/userSlice";
import api from "../api/axios";

const OwnerOrderCard = ({ data }) => {
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // handle update status

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await api.post(
        `/order/update-status/${orderId}/${shopId}`,
        { status },
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys);
      console.log("API RESPONSE:", result.data.availableBoys);
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Unable to update order status')
    }
  };

  // safety: always ensure array
  const shopOrders = data.shopOrders || [];

  // optional: skip empty orders
  if (shopOrders.length === 0) return null;
  console.log(data);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6 border max-w-3xl mx-auto">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Order #{data._id.slice(-6)}
        </h2>
        <p className="text-sm text-gray-500">{formatDate(data.createdAt)}</p>
      </div>

      {/* 🔹 User Details */}
      <div className="mb-3">
        <p className="font-medium text-gray-800">{data.user?.name || "User"}</p>
        <p className="text-sm text-gray-600">{data.user?.email}</p>
        <p className="text-sm text-gray-600">📞 {data.user?.mobile}</p>

        {data.paymentMethod === "online" ? (
          <p>Payment: {data.payment ? "Paid" : "Failed"}</p>
        ) : (
          <p className="text-sm text-gray-600">Payment Method: {data.paymentMethod}</p>
        )}
        
      </div>

      {/* 🔹 Address */}
      <div className="text-sm text-gray-600 mb-3">
        <p>{data.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-400">
          Lat: {data.deliveryAddress?.latitude} , Lon:{" "}
          {data.deliveryAddress?.longitude}
        </p>
      </div>

      {/* 🔹 Shop Orders (ARRAY now) */}
      {shopOrders.map((shopOrder, index) => (
        <div key={index} className="mb-4">
          {/* 🔸 Items */}
          <div className="flex gap-3 flex-wrap">
            {shopOrder.shopOrderItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-2 w-[130px]">
                <img
                  src={item.item?.image}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-md mb-1"
                />

                <p className="text-sm font-medium text-gray-800">{item.name}</p>

                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} x ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* 🔸 Status + Dropdown */}
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm">
              Status:{" "}
              <span className="text-orange-500 font-medium capitalize">
                {shopOrder.status}
              </span>
            </p>

            <select
              className="border px-2 py-1 rounded-md text-sm"
             onChange={(e) =>
  handleUpdateStatus(
    data._id,
    shopOrder.shop._id, // ✅ correct
    e.target.value,
  )
}
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out for delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {shopOrder.status === "out for delivery" && (
            <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
              <p>available delivery boys</p>

              {availableBoys.length > 0 ? (
                availableBoys.map((b, index) => (
                  <div key={index}>
                    {b.fullName} - {b.mobile}
                  </div>
                ))
              ) : data?.shopOrders?.assignedDeliveryBoy ? (
                <>
                  <div> assigned delivery boy {data.shopOrders.assignedDeliveryBoy.fullName}</div>
                </>
              ) : (
                <div>Waiting for delivery boy to accept</div>
              )}
            </div>
          )}

          {/* 🔸 Subtotal */}
          <div className="text-right text-sm font-medium text-gray-700 mt-1">
            Total: ₹{shopOrder.subTotal}
          </div>

          <hr className="mt-3" />
        </div>
      ))}
    </div>
  );
};

export default OwnerOrderCard;
