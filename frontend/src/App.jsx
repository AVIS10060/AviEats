import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client"

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
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import { setSocket } from "./redux/userSlice";

// export const serverUrl = "http://localhost:8000";
export const serverUrl = "https://avieats-backend.onrender.com";

const App = () => {
  const { userData, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useGetCurrentUser();
  useGetMyOrders();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetCity();
  useUpdateLocation();

useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true })

    dispatch(setSocket(socketInstance))

    socketInstance.on("connect", () => {
      console.log("Connected:", socketInstance.id)

      if (userData?._id) {
        socketInstance.emit("identity", { userId: userData._id })
      }
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [dispatch, userData])




  // ✅ BLOCK render until auth resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* Public */}
        <Route
          path="/signin"
          element={
            userData ? <Navigate to="/" replace /> : <SignIn />
          }
          />

        <Route
          path="/signup"
          element={
            userData ? <Navigate to="/" replace /> : <SignUp />
          }
          />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
          />

        {/* Protected */}
        <Route
          path="/"
          element={
            userData ? <Home /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/create-edit-shop"
          element={
            userData ? (
              <CreateEditShop />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
          />

        <Route
          path="/add-food"
          element={
            userData ? <AddItem /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/edit-item/:itemId"
          element={
            userData ? <EditItem /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/cart"
          element={
            userData ? <CartPage /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/checkout"
          element={
            userData ? <Checkout /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/order-placed"
          element={
            userData ? <OrderPlaced /> : <Navigate to="/signin" replace />
          }
          />

        <Route
          path="/my-orders"
          element={
            userData ? <MyOrders /> : <Navigate to="/signin" replace />
          }
          />
         <Route
          path="/track-order/:orderId"
          element={
            userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />
          }
          />
         <Route
          path="/shop/:shopId"
          element={
            userData ? <Shop /> : <Navigate to="/signin" replace />
          }
          />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate to={userData ? "/" : "/signin"} replace />
          }
          />

      </Routes>
    </>
  );
};

export default App;
