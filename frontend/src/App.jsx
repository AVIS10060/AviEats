import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";

// Components
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";

// Hooks
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";

export const serverUrl = "http://localhost:8000";

const App = () => {
  const { userData, isLoading } = useSelector((state) => state.user);

  // Hooks (must internally use useEffect)
  useGetCurrentUser();
  useGetMyOrders();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetCity();
  useUpdateLocation();

  // 🔥 Prevent blank screen during loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* 🔓 Public Routes */}
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/signin" />}
        />

        <Route
          path="/create-edit-shop"
          element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
        />

        <Route
          path="/add-food"
          element={userData ? <AddItem /> : <Navigate to="/signin" />}
        />

        <Route
          path="/edit-item/:itemId"
          element={userData ? <EditItem /> : <Navigate to="/signin" />}
        />

        <Route
          path="/cart"
          element={userData ? <CartPage /> : <Navigate to="/signin" />}
        />

        <Route
          path="/checkout"
          element={userData ? <Checkout /> : <Navigate to="/signin" />}
        />

        <Route
          path="/order-placed"
          element={userData ? <OrderPlaced /> : <Navigate to="/signin" />}
        />

        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to="/signin" />}
        />

        {/* 🔁 Fallback route */}
        <Route
          path="*"
          element={<Navigate to={userData ? "/" : "/signin"} />}
        />

      </Routes>
    </>
  );
};

export default App;