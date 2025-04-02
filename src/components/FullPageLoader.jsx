import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLoader } from "../context/LoaderContext";
import logo from "../assets/images/slate-R-logo.png";

const FullPageLoader = () => {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="relative w-20 h-20">
            <img
              src={logo}
              alt="Loading"
              className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 z-10"
            />
            <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-transparent animate-spin"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullPageLoader;
