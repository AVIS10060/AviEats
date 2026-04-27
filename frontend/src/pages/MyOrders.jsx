import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetMyOrders from "../hooks/useGetMyOrders";
import { useDispatch, useSelector } from "react-redux";
import UserOrderCard from "../components/user/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealTimeOrderStatus } from "../redux/userSlice";

const MyOrders = () => {
  useGetMyOrders();

  const navigate = useNavigate();
  const { userData, myOrders, socket, isOrdersLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch()

useEffect(() => {
  if (!socket) return;

  const newOrderHandler = (data) => {
    console.log("🔥 EVENT RECEIVED:", data);

    if (
      String(data?.shopOrders?.[0]?.owner?._id) ===
      String(userData?._id)
    ) {
      dispatch(
        setMyOrders((prev) => {
          const exists = prev.find((o) => o._id === data._id);
          if (exists) return prev;
          return [data, ...prev];
        })
      );
    }
  };

const updateStatusHandler = ({ orderId, shopId, userId, status }) => {
    console.log("🔥 STATUS EVENT:", { orderId, shopId, userId, status });

    if (String(userId) === String(userData?._id)) {
      dispatch(updateRealTimeOrderStatus({ orderId, shopId, status }));
    }
  };


  socket?.on("newOrder", newOrderHandler);
  socket?.on("update-status", updateStatusHandler);


  return () => {socket.off("newOrder", newOrderHandler)
    socket.off("update-status", updateStatusHandler)

  }

}, [dispatch, socket, userData]);


  if (isOrdersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {/* 🔹 Header */}
      <div className="max-w-3xl mx-auto mb-6 relative">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-center text-gray-800 mt-2">
          My Orders
        </h1>
      </div>

      {/* 🔹 Orders List */}
      <div className="max-w-3xl mx-auto">
        {!myOrders || myOrders.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No orders found</div>
        ) : (
          myOrders.map((order, index) => {
            if (userData?.role === "user") {
              return <UserOrderCard data={order} key={index} />;
            }

            if (userData?.role === "owner") {
              return <OwnerOrderCard data={order} key={index} />;
            }

            return null;
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
