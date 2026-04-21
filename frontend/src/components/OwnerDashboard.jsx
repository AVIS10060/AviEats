import React from "react";
import Navbar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const handleDeleteItem = async(itemId) =>{
    console.log(itemId)
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${itemId}`,{withCredentials:true},)
      dispatch(setMyShopData(result.data))
      
      
    } catch (error) {
      console.log(error)
      
    }

  }
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}

      {/* If no shop exists */}

      {!myShopData && (
        <div className="flex items-center justify-center h-[80vh] px-4">
          <div className="flex flex-col items-center gap-4 text-center">

            <FaUtensils className="text-5xl text-orange-500" />

            <h2 className="text-xl sm:text-2xl font-semibold">
              Add Your Restaurant
            </h2>

            <button
              onClick={() => navigate("/create-edit-shop")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Get Started
            </button>

          </div>
        </div>
      )}

      {/* If shop exists */}

      {myShopData && (
        <div className="px-4 sm:px-6 lg:px-10 py-6 flex flex-col items-center gap-8 border border-red-500">

          <h2 className="text-xl sm:text-2xl font-semibold text-center">
            Welcome to {myShopData.name}
          </h2>

          {/* Shop Card */}

          <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl overflow-hidden flex flex-col">

            <img
              src={myShopData.image}
              alt="shop"
              className="h-44 sm:h-52 w-full object-cover"
            />

            <div className="p-4 flex flex-col gap-2">

              <h3 className="text-lg sm:text-xl font-semibold">
                {myShopData.name}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base">
                {myShopData.city}, {myShopData.state}
              </p>

              <p className="text-gray-500 text-sm">
                {myShopData.address}
              </p>

            </div>
          </div>

          {/* Items Section */}

       <div className="w-full max-w-3xl flex justify-center flex-col items-center">

  <h3 className="text-lg sm:text-xl font-semibold mb-4">
    Menu Items
  </h3>

  {myShopData.items && myShopData.items.length > 0 ? (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5  bg-white shadow-2xl rounded-lg">

      {myShopData.items.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow  rounded-lg overflow-hidden hover:shadow-md transition border"
        >

          <img
            src={item.image}
            alt={item.name}
            className="h-32 sm:h-36 w-full object-cover"
          />

          <div className="p-3 flex justify-between ">

            <div className="flex flex-col gap-3 ">

            <h4 className="font-semibold text-sm sm:text-base">
              {item.name}
            </h4>

            <p className="text-gray-500 ">
              ₹{item.price}
            </p>
            <p className="">{item.category}</p>

            </div>
            <div className="flex flex-col justify-between">

            <div className="flex gap-2 justify-start  items-center h-5 mt-1 ">
              <p>{item.foodType}</p>
              {item.foodType === "veg" ?  <img src="/public/veg.png"  className="h-4 w-4" alt="" /> :  <img src="/public/nonveg.webp"  className="h-4 w-4" alt="" />}
             
            </div>
            <div className="flex gap-2 justify-start  items-center  mt-1 ">
              <p><CiEdit color="blue"  size={26} onClick={()=>navigate(`/edit-item/${item._id}`)}/></p>
              <p><MdDelete color="red" size={26} onClick={()=>handleDeleteItem(item._id)}/></p>

            </div>
            </div>
            
            

          </div>
        
        </div>
      ))}

    </div>

  ) : (

    <div className="flex flex-col items-center justify-center gap-4 w-[60%] py-10  bg-white shadow-2xl rounded-lg">

      <FaUtensils className="text-5xl text-orange-500" />

      <p className="text-gray-600 text-lg font-medium">
        Add your food item
      </p>

      <button
        onClick={() => navigate("/add-food")}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Add Food
      </button>

    </div>

  )}

</div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;