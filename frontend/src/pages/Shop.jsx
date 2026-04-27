import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { Skeleton } from "boneyard-js/react";
import { ShopPageFallback } from "../components/skeletons";
import api from "../api/axios";

const Shop = () => {
  const { shopId } = useParams();

  const [shopData, setShopData] = useState(null);
  const [isShopLoading, setIsShopLoading] = useState(true);
  const [quantity, setQuantity] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shopId) return;

    const fetchShop = async () => {
      setIsShopLoading(true);
      try {
        const result = await api.get(`/item/get-by-shop/${shopId}`);
        setShopData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsShopLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  const increasequantity = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreasequantity = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-sm" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 text-sm" />
        )
      );
    }
    return stars;
  };

  const shop = shopData?.shop;
  const items = shopData?.items;

  return (
    <Skeleton
      name="shop-page"
      loading={isShopLoading}
      fallback={<ShopPageFallback />}
      fixture={<ShopPageFallback />}
      animate="shimmer"
      transition
    >
    {!shopData ? <ShopPageFallback /> : (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 SHOP HEADER */}
      <div className="relative h-56 w-full">
        <img
          src={shop?.image}
          alt={shop?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white">
          <h1 className="text-2xl font-bold">{shop?.name}</h1>
          <p className="text-sm">
            {shop?.address}, {shop?.city}
          </p>
        </div>
      </div>

      {/* 🛒 ITEMS */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {items?.map((item) => (
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
                <h3 className="font-semibold text-md">{item.name}</h3>

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
                          );
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
    </div>
    )}
    </Skeleton>
  );
};

export default Shop;
