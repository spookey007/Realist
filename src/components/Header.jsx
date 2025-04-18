import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDevice } from "../context/DeviceContext";
import LoginModal from "./LoginModal";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import { isAdminRoute as checkIsAdminRoute } from "./utils/isAdminRoute";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, menu } = useAuth();
  const { isMobile } = useDevice();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Add effect to handle auth state changes
  useEffect(() => {
    // Reset states when user changes
    if (!user) {
      setIsMenuOpen(false);
      setIsModalOpen(false);
      setOpenLogoutDialog(false);
    }
  }, [user]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openLModal = () => setIsModalOpen(true);
  const closeLModal = () => setIsModalOpen(false);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    closeMenu();
  };

  const handleConfirmLogout = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/");
  };

  const isAdmin = checkIsAdminRoute(user?.menu || [], location.pathname);

  if (isAdmin) return null; // ✅ Hides header

  const HeaderComponent = isMobile ? MobileHeader : DesktopHeader;

  return (
    <>
      <HeaderComponent
        user={user}
        openLModal={openLModal}
        handleLogoutClick={handleLogoutClick}
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
      />

      <AnimatePresence>
        {openLogoutDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                {/* Close Button */}
                <button
                  onClick={() => setOpenLogoutDialog(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Content */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Logout Confirmation
                  </h2>
                  <p className="text-white/70 mb-8">
                    Are you sure you want to logout from your account?
                  </p>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setOpenLogoutDialog(false)}
                      className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Method='1' means sign in */}
      <LoginModal isOpen={isModalOpen} closeModal={closeLModal} Method={1} />
    </>
  );
};

export default Header;
