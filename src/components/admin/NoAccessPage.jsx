import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NoAccessPage = () => {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out effect
          className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-500/20 rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="text-5xl mb-4">
                <span role="img" aria-label="lock emoji">
                  🔒
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                You do not have permission to view this page.
              </h1>
              <p className="text-gray-600">
                Please contact an admin if you believe this is a mistake.
              </p>
              <div className="mt-6 text-4xl">
                <span role="img" aria-label="no entry emoji">
                  🚫
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };
  
  export default NoAccessPage;