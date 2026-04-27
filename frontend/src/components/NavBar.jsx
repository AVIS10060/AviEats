import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Navbar = () => {

 




  const navigate = useNavigate()

  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentCity, userData, cartItems, isLoading } = useSelector((state) => state.user)
  const { myShopData } = useSelector((state) => state.owner)
  const dispatch = useDispatch()
  const [query, setQuery] = useState("")
  const role = userData?.role || "user"

  const handleLogout = async () => {
    try {
      await api.get("/auth/signout")
      dispatch(setUserData(null))
      toast.success('Signed out successfully')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Sign out failed')
    }
  }

  const userInitial = userData?.fullName?.charAt(0).toUpperCase()


    const handleSearchItems = React.useCallback(
    async (query) => {
      try {
        const { data } = await api.get(
          `/item/search-items?query=${encodeURIComponent(query)}&city=${currentCity}`,
          { skipGlobalLoading: true },
        )

        dispatch(setSearchItems(data))
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Search failed')
      }
    },
    [currentCity, dispatch],
  )

  useEffect(() => {
    if (query) {
      handleSearchItems(query)
    } else {
      dispatch(setSearchItems(null))
    }
  }, [query, dispatch, handleSearchItems])

  return (
    <>
      <nav className="w-full fixed z-10 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="text-xl font-bold text-orange-500">
          AviEats
        </div>

        {/* CENTER (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center gap-6">

          {/* Location */}
          {role === "user" && 
           <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{currentCity}</span>
          </div>

          }
         

          {/* Search */}
          {role=== "user" && 
          <div className="relative">
            <input
              onChange={(e)=>setQuery(e.target.value)}
              value={query}
              type="text"
              placeholder="Search for dishes"
              className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          }
          

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 text-xs mx-4">
          {/* Location */}
            <div className="flex items-center gap-1 md:hidden text-gray-600">
            <FaMapMarkerAlt />
            <span>{currentCity}</span>
          </div>
        

          {/* MOBILE SEARCH ICON */}
          {role === "user" && 
           <button
            className="md:hidden text-xl"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FaSearch />
          </button>}
         

          {/* CART */}
          {role=== "user" && 
          <div className="relative cursor-pointer text-xl">

            <FaShoppingCart />

            <span onClick={() => navigate("/cart")} className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
              {cartItems?.length || 0}
            </span>

          </div>}

          {/* add food item  */}
          {role === "owner" ? 
          (<>
          {myShopData && 
          <>
           <button onClick={()=>navigate("/add-food")} className="md:flex hidden  items-center cursor-pointer gap-1 p-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
            <FaPlus  size={20}/>
            <span>add food item</span>
          </button> 
          <button className="flex md:hidden items-center cursor-pointer gap-1 p-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
            <FaPlus  size={20}/>
          </button>
         
          </>
          }
           <div onClick={()=>navigate("/my-orders")} className="flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium">
          <FaReceipt size={20}/>
          <span>My orders</span>
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
              0
            </span>

          </div>

         
          </> )
          : 
          (<>
           <button onClick={()=>navigate("/my-orders")} className="hidden md:block border px-3 py-1 rounded-lg hover:bg-gray-100">
            My Orders
          </button>
          </>)
          
          }
          

          {/* MY ORDERS (DESKTOP) */}
         

          {/* USER INITIAL */}
          <div className="relative">

            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold"
              disabled={isLoading || !userData}
            >
              {isLoading || !userData ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                userInitial
              )}
            </button>

            {/* USER DROPDOWN */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 border">

                <div className="px-4 py-2 border-b text-sm">
                  {userData?.fullName || "User"}
                </div>

                {/* My Orders for mobile */}
                {role === "user" && 
                 <button onClick={()=>navigate('/my-orders')} className="w-full block lg:hidden text-left px-4 py-2 hover:bg-gray-100 text-sm">
                  My Orders
                </button>

                }
               

                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500">
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </nav>

      {/* MOBILE SEARCH DROPDOWN */}
      {role==="user" && showSearch && (
        <div className="md:hidden px-4 py-3 border-b bg-white">

          <input
            type="text"
            placeholder="Search for dishes"
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        </div>
      )}
    </>
  );
};

export default Navbar;
