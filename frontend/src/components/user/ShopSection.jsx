import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShopSection = () => {

  const { currentCity, shopsInMyCity, isShopsLoading } = useSelector(state => state.user)
  const navigate = useNavigate()
  const isLoading = !currentCity || isShopsLoading


  const scrollRef = useRef(null)

  const scrollHandler = (direction) => {

    const container = scrollRef.current
    const scrollAmount = 300

    if (direction === "left") {
      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      })
    }

    if (direction === "right") {
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
        Loading shops...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
        Best shops in {currentCity}
      </h1>

      <div className="relative">

        <button
          onClick={() => scrollHandler("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >

          {shopsInMyCity && shopsInMyCity.map((shop) => (

            <div
              onClick={()=>navigate(`/shop/${shop._id}`)}

              key={shop._id}
              className="min-w-[220px] bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
            >

              <img
                src={shop.image}
                alt={shop.name}
                className="h-40 w-full object-cover"
              />

              <div className="p-3">

                <h3 className="font-semibold text-lg">
                  {shop.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {shop.city}
                </p>

              </div>

            </div>

          ))}

        </div>

        <button
          onClick={() => scrollHandler("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        >
          <FaChevronRight />
        </button>

      </div>

    </div>
  );
};

export default ShopSection;
