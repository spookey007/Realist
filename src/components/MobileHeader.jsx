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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/30 active:scale-90"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-all duration-300`}></i>
          </button>
        </div>

        <nav className="hidden md:flex md:space-x-6 items-center">
          <Link to="/" onClick={closeMenu} className="py-2 px-4 text-white text-lg hover:text-gray-200 transition duration-300">Home</Link>
          <Link to="/about" onClick={closeMenu} className="py-2 px-4 text-white text-lg hover:text-gray-200 transition duration-300">About Us</Link>
          {user ? (
            <button onClick={handleLogoutClick} className="py-2 px-4 text-white text-lg border border-white rounded-md hover:bg-white hover:text-cyan-600 transition duration-300">Logout</button>
          ) : (
            <button onClick={openLModal} className="py-2 px-4 bg-white text-cyan-600 text-lg rounded-md hover:bg-gray-100 transition duration-300">Sign In</button>
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
            className="fixed top-0 left-0 w-full h-full bg-cyan-600 shadow-md z-50"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <Link to="/" onClick={closeMenu}>
                <img src={logo} alt="Realist" className="w-auto h-8" />
              </Link>
              <button 
                onClick={toggleMenu} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/30"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    onClick={closeMenu} 
                    className="block py-3 px-4 text-white text-lg hover:bg-white/10 rounded-lg transition duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    onClick={closeMenu} 
                    className="block py-3 px-4 text-white text-lg hover:bg-white/10 rounded-lg transition duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  {user ? (
                    <button 
                      onClick={handleLogoutClick} 
                      className="w-full py-3 px-4 text-white text-lg border border-white rounded-lg hover:bg-white hover:text-cyan-600 transition duration-300"
                    >
                      Logout
                    </button>
                  ) : (
                    <button 
                      onClick={() => { openLModal(); closeMenu(); }} 
                      className="w-full py-3 px-4 bg-white text-cyan-600 text-lg rounded-lg hover:bg-gray-100 transition duration-300"
                    >
                      Sign In
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileHeader;
