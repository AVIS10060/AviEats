import React from "react";

const CategoryCard = ({ data }) => {

  return (

    <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-3 hover:shadow-lg transition cursor-pointer">

      <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] flex items-center justify-center">

        <img
          src={data.image}
          alt={data.category}
          className="w-full h-full object-cover"
        />

      </div>

      <p className="mt-3 text-sm sm:text-base font-medium text-gray-700">
        {data.category}
      </p>

    </div>

  );
};

export default CategoryCard;