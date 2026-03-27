import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Popup Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Thank you for your order. You can track your orders here.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/my-orders")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
}

export default OrderPlaced;