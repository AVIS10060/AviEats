import React from "react";
import Navbar from "../NavBar";
import CategorySection from "./CategorySection";
import ShopSection from "./ShopSection";
import ItemSection from "./ItemSection";
import SearchItems from "./SearchItems";
import { useSelector } from "react-redux";

const UserDashboard = () => {

  const { searchItems } = useSelector((state) => state.user)

  const isSearching = searchItems && searchItems.length > 0

  return (
    <div className="min-h-screen w-full bg-gray-100 mt-14">

      {/* <Navbar /> */}

      {isSearching ? (
        <SearchItems />
      ) : (
        <>
          <CategorySection />
          <ShopSection />
          <ItemSection />
        </>
      )}

    </div>
  );
};

export default UserDashboard;