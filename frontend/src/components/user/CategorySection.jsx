import React, { useRef } from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "../../category.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategorySection = () => {

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
        Inspiration for your first order
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
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
        >

          {categories.map((data, index) => (
            <CategoryCard key={index} data={data} onClick />
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

export default CategorySection;