import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";

export const serverUrl = "http://localhost:8000";

const App = () => {
  const { userData, isLoading } = useSelector((state) => state.user);
useGetCurrentUser();
useGetMyOrders();
useGetMyShop();
useGetShopByCity();
useGetItemsByCity();  
useGetCity()
useUpdateLocation()


  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* Public routes */}
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

        {/* Protected route */}
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/signin" />}
        />
         <Route
          path="/create-edit-shop"
          element={userData ?<CreateEditShop /> : <Navigate to="/signin" />}
        />
         <Route
          path="/add-food"
          element={userData && <AddItem />}
        />
         <Route
          path="/edit-item/:itemId"
          element={userData && <EditItem />}
        />
         <Route
          path="/cart"
          element={userData && <CartPage />}
        />
         <Route
          path="/checkout"
          element={userData && <Checkout />}
        />
         <Route
          path="/order-placed"
          element={userData && <OrderPlaced />}
        />
        <Route
          path="/my-orders"
          element={userData && <MyOrders />}
        />

      </Routes>
    </>
  );
};

export default App;