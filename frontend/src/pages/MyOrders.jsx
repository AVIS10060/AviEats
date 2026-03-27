import React from "react";
import { useNavigate } from "react-router-dom";
import useGetMyOrders from "../hooks/useGetMyOrders";
import { useSelector } from "react-redux";
import UserOrderCard from "../components/user/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";

const MyOrders = () => {
  useGetMyOrders();

  const navigate = useNavigate();
  const { userData, myOrders } = useSelector((state) => state.user);

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
          <div className="text-center text-gray-500 mt-10">
            No orders found
          </div>
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