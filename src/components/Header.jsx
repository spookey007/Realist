import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDevice } from "../context/DeviceContext";
import LoginModal from "./LoginModal";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import { isAdminRoute as checkIsAdminRoute } from "./utils/isAdminRoute";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, menu } = useAuth();
  const { isMobile } = useDevice();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

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

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle className="font-bold">Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
      {/* Method='1' means sign in */}
      <LoginModal isOpen={isModalOpen} closeModal={closeLModal} Method={1} />
    </>
  );
};

export default Header;
