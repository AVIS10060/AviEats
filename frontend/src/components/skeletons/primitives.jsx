import React from "react";

export const Bone = ({ className = "" }) => {
  return <div className={`rounded-xl bg-gray-200/90 ${className}`.trim()} />;
};

export const CircleBone = ({ className = "" }) => {
  return <Bone className={`rounded-full ${className}`.trim()} />;
};

export const TextStack = ({ lines = ["w-full"], gapClass = "gap-2" }) => {
  return (
    <div className={`flex flex-col ${gapClass}`}>
      {lines.map((widthClass, index) => (
        <Bone key={index} className={`h-4 ${widthClass}`.trim()} />
      ))}
    </div>
  );
};

export const ActionPillSkeleton = ({ className = "" }) => {
  return <Bone className={`h-10 rounded-full ${className}`.trim()} />;
};

export const IconButtonSkeleton = ({ className = "" }) => {
  return <CircleBone className={`h-10 w-10 ${className}`.trim()} />;
};

export const MediaCardSkeleton = ({
  imageClassName,
  bodyClassName = "",
  children,
  className = "",
}) => {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-md ${className}`.trim()}
    >
      <Bone className={imageClassName} />
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export const ProductActionSkeleton = () => {
  return (
    <div className="flex items-center gap-1 border rounded-full overflow-hidden w-[70%]">
      <Bone className="h-10 w-10 rounded-none" />
      <Bone className="h-4 w-6" />
      <Bone className="h-10 w-10 rounded-none" />
      <Bone className="h-10 w-10 rounded-none bg-gray-300/90" />
    </div>
  );
};

export const ItemTileSkeleton = () => {
  return (
    <div className="border rounded-lg p-2 w-[130px] shadow-sm">
      <Bone className="w-full h-20 rounded-md mb-1" />
      <Bone className="h-4 w-4/5 mb-2" />
      <Bone className="h-3 w-3/5" />
    </div>
  );
};

export const OrderCardSkeleton = ({ showHeaderBlock = false, showAction = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border">
      <div className="flex justify-between items-center mb-2">
        {showHeaderBlock ? (
          <div className="space-y-2">
            <Bone className="h-5 w-28" />
            <Bone className="h-4 w-24" />
          </div>
        ) : (
          <Bone className="h-6 w-28" />
        )}
        <div className="space-y-2 text-right">
          <Bone className="h-4 w-20 ml-auto" />
          <Bone className="h-4 w-16 ml-auto" />
        </div>
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-4">
        <Bone className="h-5 w-40 mb-2" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ItemTileSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 text-sm">
        <Bone className="h-4 w-28" />
        <Bone className="h-4 w-20" />
      </div>

      {showAction && (
        <div className="flex justify-between items-center mt-3">
          <Bone className="h-5 w-28" />
          <Bone className="h-9 w-28 rounded-md bg-gray-300/90" />
        </div>
      )}
    </div>
  );
};
