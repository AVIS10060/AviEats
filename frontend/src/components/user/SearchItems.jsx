import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../../redux/userSlice";

const SearchItems = () => {

  const { searchItems } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [quantity, setQuantity] = useState({})

  const increasequantity = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  const decreasequantity = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }))
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-sm" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 text-sm" />
        )
      )
    }
    return stars
  }

  if (!searchItems || searchItems.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        No items found
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h2 className="text-xl font-semibold mb-6">
        Search Results
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {searchItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
          >

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-cover"
            />

            <div className="p-3 flex flex-col gap-2">

              {/* Name */}
              <h3 className="font-semibold text-md">
                {item.name}
              </h3>

              {/* Shop name (extra useful in search) */}
              <p className="text-xs text-gray-400">
                {item.shop?.name}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex">
                  {renderStars(item.rating?.average || 0)}
                </div>
                <span className="text-gray-500">
                  ({item.rating?.count || 0})
                </span>
              </div>

              {/* Price + Cart */}
              <div className="flex items-center justify-between mt-2 w-full">
                <span className="font-semibold text-lg">
                  ₹{item.price}
                </span>

                <div className="flex items-center gap-1 border rounded-full overflow-hidden w-[70%]">

                  <button
                    onClick={() => decreasequantity(item._id)}
                    className="px-3 text-lg font-semibold"
                  >
                    -
                  </button>

                  <span className="px-3 text-sm">
                    {quantity[item._id] || 0}
                  </span>

                  <button
                    onClick={() => increasequantity(item._id)}
                    className="px-2 text-lg font-semibold"
                  >
                    +
                  </button>

                  <button
                    onClick={() => {
                      if (quantity[item._id] > 0) {
                        dispatch(
                          addToCart({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            shop: item.shop,
                            quantity: quantity[item._id],
                            foodType: item.foodType,
                          })
                        )
                      }
                    }}
                    className="bg-orange-700 hover:bg-amber-500 text-white px-3 py-2 flex items-center justify-center"
                  >
                    <FaShoppingCart size={14} />
                  </button>

                </div>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default SearchItems