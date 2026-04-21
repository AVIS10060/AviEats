import React from "react";
import Navbar from "../NavBar";
import CategorySection from "./CategorySection";
import ShopSection from "./ShopSection";
import ItemSection from "./ItemSection";

const UserDashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 mt-10">

      {/* <Navbar /> */}

      <CategorySection />

      <ShopSection />

      <ItemSection />

    </div>
  );
};

export default UserDashboard;