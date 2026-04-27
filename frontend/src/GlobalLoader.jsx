import { useSelector } from "react-redux";

const GlobalLoader = ({ children }) => {
  const globalLoading = useSelector((state) => state.ui?.globalLoading);

  return (
    <>
      {children}
      {globalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-2xl bg-white px-6 py-4 shadow-xl">
            <p className="text-gray-800 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
