import React, { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDevice } from "../context/DeviceContext";
import LoginModal from "./LoginModal";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";

const Header = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout, user } = useAuth();

  const { isMobile } = useDevice();

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


  return (
    <>
      {isMobile ? (
        <MobileHeader
          user={user}
          openLModal={openLModal}
          handleLogoutClick={handleLogoutClick}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
        />
      ) : (
    
        <DesktopHeader
          user={user}
          openLModal={openLModal}
          handleLogoutClick={handleLogoutClick}
          closeMenu={closeMenu}
        />
      )}

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle className="font-bold">Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>

      <LoginModal isOpen={isModalOpen} closeModal={closeLModal} />
    </>
  );
};

export default Header;
