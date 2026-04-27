import { useSelector } from "react-redux";
import { Skeleton } from "boneyard-js/react";
import { AppShellFallback } from "./components/skeletons";

const GlobalLoader = ({ children }) => {
  const { globalLoading } = useSelector((state) => state.ui);

  return (
    <>
    <Skeleton
      loading={globalLoading}
      fallback={<AppShellFallback />}
      animate="shimmer"
    >
      {children}
    </Skeleton>
    </>
  );
};

export default GlobalLoader;