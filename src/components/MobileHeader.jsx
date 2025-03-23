import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/slate-R-logo.png";
import '@fortawesome/fontawesome-free/css/all.css';

const MobileHeader = ({ user, openLModal, handleLogoutClick, toggleMenu, isMenuOpen, closeMenu }) => {
  return (
    <header className="w-full shadow-md bg-white h-16">
      <div className="px-3 py-1 flex justify-between items-center h-full relative transition-all duration-500 bg-cyan-600">
        <div className="w-2/5 md:w-1/5 lg:w-1/6">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Realist" className="w-full h-auto max-w-[70px]" />
          </Link>
        </div>

        <div className="md:hidden flex items-center justify-center">
          <button 
            onClick={toggleMenu} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white transition-all duration-300 shadow-lg hover:bg-black active:scale-90"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl transition-all duration-300`}></i>
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

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-full bg-white shadow-md z-50"
          >
            <button 
              onClick={toggleMenu} 
              className="absolute top-4 right-4 p-2 bg-black text-white rounded-full text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <ul className="mt-16 text-center space-y-6">
              <li>
                <Link to="/" onClick={closeMenu} className="text-2xl text-gray-800 hover:text-blue-500">Home</Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMenu} className="text-2xl text-gray-800 hover:text-blue-500">About Us</Link>
              </li>
              <li>
                {user ? (
                  <button onClick={handleLogoutClick} className="text-2xl text-gray-800 hover:text-red-500">Logout</button>
                ) : (
                  <button onClick={() => { openLModal(); closeMenu(); }} className="text-2xl text-gray-800 hover:text-green-500">Sign In</button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileHeader;
