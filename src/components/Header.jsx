import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import logo from '../assets/images/slate-R-logo.svg';
import '@fortawesome/fontawesome-free/css/all.css';
import '../assets/css/header.css';
import LoginModal from './LoginModal'; // Import Modal
const Header = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // New function to close the menu
  const closeMenu = () => setIsMenuOpen(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLModal = () => setIsModalOpen(true);
  const closeLModal = () => setIsModalOpen(false);

  // Show logout confirmation dialog
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

    // Confirm logout & remove session
    const handleConfirmLogout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setOpenLogoutDialog(false);
      navigate("/"); // Redirect to home/login
    };

  return (
    <header className="w-full shadow-md bg-white">
      {/* <div className="bg-white-800 px-4 py-2 flex justify-center md:justify-end items-center text-white invisible">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-envelope text-yellow-400"></i>
            <a href="mailto:YOUR EMAIL" className="text-sm md:text-base font-bold text-white hover:text-yellow-400">
            YOUR EMAIL
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-yellow-400"></i>
            <a href="YOUR ADDRESS URL" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-bold text-white hover:text-yellow-400">
            YOUR ADDRESS
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-phone-alt text-yellow-400"></i>
            <a href="tel:+YOUR PHONE NUMBER" className="text-sm md:text-base font-bold text-white hover:text-yellow-400">
              YOUR PHONE NUMBER
            </a>
          </div>
        </div>
      </div> */}

      {/* Main Section with Logo and Nav */}
      <div className="bg-white-800 p-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="w-2/5 md:w-1/5 lg:w-1/6">
          <img src={logo} alt="Realist" className="w-full h-auto max-w-[100px]" />
        </div>

        {/* Hamburger Menu (for mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none p-2 rounded-md bg-black text-white hover:bg-gray-700 transition duration-300"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className={`md:flex md:space-x-6 items-center absolute md:relative w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none z-10 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          style={{ top: 'calc(100% + 0rem)', left: 0 }} // Adjust the position to align below the logo
        >
          <Link
            to="/about"
            onClick={closeMenu}
            className="relative block py-4 px-6 md:py-2 md:px-4 text-black text-lg transition duration-300 
                      no-underline hover:no-underline
                      after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
                      after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 
                      after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] 
                      hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            About Us
          </Link>
          <>
          {authToken ? (
            // Show Logout button if user is logged in
            <button onClick={handleLogoutClick} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
              Logout
            </button>
          ) : (
            // Show Sign In button if user is NOT logged in
            <button onClick={openLModal} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-gray-900 px-6 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
              Sign In
            </button>
          )}

          {/* Logout Confirmation Dialog */}
          <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
              <Button onClick={handleConfirmLogout} color="error">Logout</Button>
            </DialogActions>
          </Dialog>
        </>
        </nav>
      </div>
      <LoginModal isOpen={isModalOpen} closeModal={closeLModal} />
    </header>
  );
};

export default Header;
