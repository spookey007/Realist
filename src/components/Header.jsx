import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/slate-R-logo.svg';
import '@fortawesome/fontawesome-free/css/all.css';
import '../assets/css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // New function to close the menu
  const closeMenu = () => setIsMenuOpen(false);

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
            onClick={closeMenu} // Close menu on click
            className="block py-4 px-6 md:py-2 md:px-4 text-black hover:bg-white text-lg transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/about"
            onClick={closeMenu} // Close menu on click
            className="bg-black block py-4 px-6 md:py-1 md:px-5 text-white hover:bg-white text-lg transition duration-300 border border-gray-400 rounded-lg"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
