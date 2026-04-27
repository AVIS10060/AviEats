import React from "react";
import {
  ActionPillSkeleton,
  Bone,
  CircleBone,
  IconButtonSkeleton,
  ItemTileSkeleton,
  MediaCardSkeleton,
  OrderCardSkeleton,
  ProductActionSkeleton,
  TextStack,
} from "./primitives";

const ShopCarouselCardSkeleton = () => {
  return (
    <div className="min-w-[220px] bg-white rounded-xl shadow-md overflow-hidden">
      <Bone className="h-40 w-full rounded-none" />
      <div className="p-3">
        <Bone className="h-6 w-2/3 mb-2" />
        <Bone className="h-4 w-1/2" />
      </div>
    </div>
  );
};

const FoodGridCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Bone className="h-40 w-full rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Bone className="h-5 w-2/3" />
        <div className="flex items-center gap-2 text-sm">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <CircleBone key={index} className="h-3 w-3 rounded-sm" />
            ))}
          </div>
          <Bone className="h-4 w-10" />
        </div>
        <div className="flex items-center justify-between mt-2 w-full">
          <Bone className="h-6 w-14" />
          <ProductActionSkeleton />
        </div>
      </div>
    </div>
  );
};

const OwnerMenuCardSkeleton = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transition border">
      <Bone className="h-32 sm:h-36 w-full rounded-none" />
      <div className="p-3 flex justify-between">
        <div className="flex flex-col gap-3">
          <Bone className="h-5 w-20" />
          <Bone className="h-4 w-12" />
          <Bone className="h-4 w-16" />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 justify-start items-center h-5 mt-1">
            <Bone className="h-4 w-10" />
            <CircleBone className="h-4 w-4 rounded-sm" />
          </div>
          <div className="flex gap-2 justify-start items-center mt-1">
            <CircleBone className="h-6 w-6 rounded-md" />
            <CircleBone className="h-6 w-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryAssignmentCardSkeleton = () => {
  return (
    <div className="border p-3 mb-3 rounded-lg">
      <Bone className="h-5 w-32 mb-2" />
      <Bone className="h-4 w-2/3 mb-3" />
      <div className="mt-2 space-y-2">
        <Bone className="h-4 w-24" />
        <Bone className="h-4 w-28" />
      </div>
      <Bone className="mt-3 h-5 w-14" />
      <Bone className="mt-3 h-10 w-full rounded-lg bg-gray-300/90" />
    </div>
  );
};

export const AppShellFallback = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <nav className="w-full fixed z-10 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <Bone className="h-7 w-24" />
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <CircleBone className="h-4 w-4 rounded-sm" />
            <Bone className="h-4 w-20" />
          </div>
          <Bone className="h-10 w-64 rounded-lg" />
        </div>
        <div className="flex items-center gap-4 text-xs mx-4">
          <div className="flex items-center gap-1 md:hidden text-gray-600">
            <CircleBone className="h-4 w-4 rounded-sm" />
            <Bone className="h-4 w-16" />
          </div>
          <IconButtonSkeleton className="md:hidden h-8 w-8" />
          <div className="relative">
            <CircleBone className="h-6 w-6 rounded-sm" />
            <CircleBone className="absolute -top-1 -right-1 h-4 w-4 text-xs" />
          </div>
          <CircleBone className="h-9 w-9" />
        </div>
      </nav>

      <div className="min-h-screen w-full bg-gray-100 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Bone className="h-10 w-72 mb-6" />
          <div className="relative">
            <IconButtonSkeleton className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 shadow-md bg-white" />
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[120px]">
                  <CircleBone className="h-24 w-24 mx-auto mb-3" />
                  <Bone className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
            <IconButtonSkeleton className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 shadow-md bg-white" />
          </div>
        </div>

        <ShopSectionFallback />
        <ItemSectionFallback />
      </div>
    </div>
  );
};

export const ShopSectionFallback = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Bone className="h-9 w-64 mb-6" />
      <div className="relative">
        <IconButtonSkeleton className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 shadow-md bg-white" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShopCarouselCardSkeleton key={index} />
          ))}
        </div>
        <IconButtonSkeleton className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 shadow-md bg-white" />
      </div>
    </div>
  );
};

export const ItemSectionFallback = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Bone className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <FoodGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export const OwnerDashboardFallback = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 flex flex-col items-center gap-8">

      {/* Header */}
      <div className="text-center">
        <Bone className="h-6 sm:h-7 w-48 mx-auto" />
      </div>

      {/* Shop Card */}
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl overflow-hidden flex flex-col">

        {/* Image */}
        <Bone className="h-44 sm:h-52 w-full rounded-none" />

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <Bone className="h-6 w-40" />
          <Bone className="h-4 w-32" />
          <Bone className="h-4 w-2/3" />
        </div>

      </div>

      {/* Menu Section */}
      <div className="w-full max-w-3xl flex flex-col items-center">

        {/* Title */}
        <div className="mb-4">
          <Bone className="h-5 w-28" />
        </div>

        {/* Grid EXACTLY same as real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 bg-white shadow-2xl rounded-lg w-full">

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg overflow-hidden border"
            >
              {/* Image */}
              <Bone className="h-32 sm:h-36 w-full rounded-none" />

              {/* Content */}
              <div className="p-3 flex justify-between">

                {/* Left */}
                <div className="flex flex-col gap-2">
                  <Bone className="h-4 w-20" />
                  <Bone className="h-4 w-16" />
                  <Bone className="h-3 w-14" />
                </div>

                {/* Right (icons section mimic) */}
                <div className="flex flex-col justify-between">
                  <Bone className="h-3 w-10" />
                  <div className="flex gap-2 mt-1">
                    <Bone className="h-5 w-5 rounded-full" />
                    <Bone className="h-5 w-5 rounded-full" />
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export const OrderListFallback = ({ role = "user" }) => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-3xl mx-auto mb-6 relative">
        <Bone className="h-5 w-12" />
        <Bone className="mx-auto mt-2 h-7 w-28" />
      </div>

      <div className="max-w-3xl mx-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <OrderCardSkeleton
            key={index}
            showHeaderBlock={role === "user"}
            showAction={role === "user"}
          />
        ))}
      </div>
    </div>
  );
};

export const ShopPageFallback = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-56 w-full">
        <Bone className="w-full h-full rounded-none" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white">
          <Bone className="h-8 w-48 bg-white/30" />
          <Bone className="h-4 w-56 mt-2 bg-white/20" />
        </div>
      </div>

      <div className="p-6">
        <Bone className="h-8 w-20 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <FoodGridCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrackOrderFallback = () => {
  return (
    <div className="p-4 space-y-4">
      <Bone className="h-8 w-32" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <Bone className="h-4 w-24 mb-2" />
          <Bone className="h-5 w-40 mb-2" />
          <Bone className="h-4 w-2/3 mb-2" />
          <Bone className="h-5 w-16 mb-2" />
          <Bone className="h-4 w-3/4 mb-3" />

          <div className="mt-3">
            <Bone className="h-5 w-28 mb-2" />
            <TextStack lines={["w-32", "w-28"]} />
          </div>

          <div className="mt-4 w-full h-[400px] rounded-xl overflow-hidden shadow-md">
            <Bone className="h-full w-full rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DeliveryDashboardFallback = () => {
  return (
    <div className="p-4 mt-12">
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <Bone className="h-7 w-44 mb-3" />
        <Bone className="h-4 w-64" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Bone className="h-6 w-28 mb-3" />
        <Bone className="h-5 w-40 mb-2" />
        <Bone className="h-4 w-2/3 mb-2" />
        <Bone className="h-4 w-20 mb-2" />
        <Bone className="h-5 w-12 mb-4" />
        <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
          <Bone className="h-full w-full rounded-none" />
        </div>
        <Bone className="mt-4 h-12 w-full rounded-xl bg-gray-300/90" />
      </div>
    </div>
  );
};

export const CheckoutFallback = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="relative mb-6">
        <Bone className="absolute left-0 h-5 w-12" />
        <Bone className="text-center h-8 w-28 mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto mb-4 flex gap-2">
        <Bone className="w-full h-12 rounded-lg" />
        <Bone className="h-12 w-24 rounded-lg bg-gray-300/90" />
        <Bone className="h-12 w-40 rounded-lg" />
      </div>

      <div className="max-w-2xl mx-auto h-[300px] overflow-hidden rounded-xl shadow-md">
        <Bone className="w-full h-full rounded-none" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mt-6 bg-white p-5 rounded-xl shadow">
          <Bone className="h-6 w-36 mb-4" />
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3">
                <CircleBone className="h-6 w-6 rounded-md" />
                <div className="flex-1">
                  <Bone className="h-5 w-32 mb-2" />
                  <Bone className="h-4 w-40" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 rounded-lg border-2 border-orange-200 bg-orange-50/60">
              <div className="flex items-center gap-3">
                <CircleBone className="h-6 w-6 rounded-md" />
                <div className="flex-1">
                  <Bone className="h-5 w-36 mb-2" />
                  <Bone className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-5 rounded-xl shadow">
          <Bone className="h-6 w-32 mb-4" />
          <div className="space-y-3 text-sm">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between">
                <Bone className="h-4 w-32" />
                <Bone className="h-4 w-16" />
              </div>
            ))}
            <div className="flex justify-between text-gray-600">
              <Bone className="h-4 w-16" />
              <Bone className="h-4 w-14" />
            </div>
            <div className="flex justify-between text-gray-600">
              <Bone className="h-4 w-20" />
              <Bone className="h-4 w-12" />
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <Bone className="h-6 w-16" />
              <Bone className="h-6 w-20" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Bone className="w-full h-12 rounded-lg bg-gray-300/90" />
        </div>
      </div>
    </div>
  );
};
