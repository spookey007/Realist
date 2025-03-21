import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import logo from '../assets/images/slate-R-logo.png';
import '@fortawesome/fontawesome-free/css/all.css';
import '../assets/css/header.css';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  
    
  const navigate = useNavigate();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState("bg-blue-500");
  const { logout,user } = useAuth();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openLModal = () => setIsModalOpen(true);
  const closeLModal = () => setIsModalOpen(false);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    closeMenu();
  };

  const handleConfirmLogout = () => {
    logout(); // Call context logout to clear user and token
    setOpenLogoutDialog(false); // Close dialog
    navigate("/"); // Redirect to login or home
  };

  useEffect(() => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-red-500", "bg-green-500", "bg-indigo-500"];
    let index = 0;
    const interval = setInterval(() => {
      setBgColor(colors[index]);
      index = (index + 1) % colors.length;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full shadow-md bg-white">
      <div className={`p-4 flex justify-between items-center relative transition-all duration-500 ${bgColor}`}>
        <div className="w-2/5 md:w-1/5 lg:w-1/6">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Realist" className="w-full h-auto max-w-[100px]" />
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none p-2 rounded-md bg-black text-white hover:bg-gray-700 transition duration-300">
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        <nav className="hidden md:flex md:space-x-6 items-center">
          <Link to="/" onClick={closeMenu} className="py-2 px-4 text-white text-lg hover:text-gray-200 transition duration-300">Home</Link>
          <Link to="/about" onClick={closeMenu} className="py-2 px-4 text-white text-lg hover:text-gray-200 transition duration-300">About Us</Link>
          {user ? (
            <button onClick={handleLogoutClick} className="py-2 px-4 text-white text-lg border border-white rounded-md hover:bg-white hover:text-blue-500 transition duration-300">Logout</button>
          ) : (
            <button onClick={openLModal} className="py-2 px-4 bg-white text-blue-500 text-lg rounded-md hover:bg-gray-100 transition duration-300">Sign In</button>
          )}
        </nav>
      </div>

      <div className={`md:hidden fixed top-0 left-0 w-full h-full bg-white shadow-md transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-500 z-50`}> 
        <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 bg-black text-white rounded-full text-2xl">
          <i className="fas fa-times"></i>
        </button>
        <ul className="mt-16 text-center space-y-6">
          <li><Link to="/" onClick={closeMenu} className="text-2xl text-gray-800 hover:text-blue-500">Home</Link></li>
          <li><Link to="/about" onClick={closeMenu} className="text-2xl text-gray-800 hover:text-blue-500">About Us</Link></li>
          <li>
            {user ? (
              <button onClick={handleLogoutClick} className="text-2xl text-gray-800 hover:text-red-500">Logout</button>
            ) : (
              <button onClick={() => { openLModal(); closeMenu(); }} className="text-2xl text-gray-800 hover:text-green-500">Sign In</button>
            )}
          </li>
        </ul>
      </div>

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle className="font-bold">Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>

      <LoginModal isOpen={isModalOpen} closeModal={closeLModal} />
    </header>
  );
};

export default Header;
