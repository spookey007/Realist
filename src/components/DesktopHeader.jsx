import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/slate-R-logo.png";

const DesktopHeader = ({ user, openLModal, handleLogoutClick, closeMenu }) => {
  return (
        <header className="fixed top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white h-16 w-4/5 md:w-2/5 z-50">
        <div className="px-3 py-1 flex justify-between items-center h-full relative transition-all duration-500 bg-cyan-600 rounded-lg">
            <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Realist" className="w-full h-auto max-w-[70px]" />
            </Link>

            <nav className="hidden md:flex md:space-x-6 items-center">
            <Link
                to="/"
                onClick={closeMenu}
                role="link"
                className="relative no-underline hover:no-underline text-white hover:text-white text-lg py-2 px-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65,0.05,0.36,1)] hover:after:scale-x-100"
                >
                Home
            </Link>

            <Link
                to="/about"
                onClick={closeMenu}
                role="link"
                className="relative no-underline hover:no-underline text-white hover:text-white text-lg py-2 px-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65,0.05,0.36,1)] hover:after:scale-x-100"
                >
                About Us
            </Link>



            {user ? (
                <button
                onClick={handleLogoutClick}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-cyan-600 px-6 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                >
                Logout
                </button>
            ) : (
                <button
                onClick={openLModal}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-cyan-600 px-6 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                >
                Sign In
                </button>
            )}
            </nav>
        </div>
        </header>
  );
};

export default DesktopHeader;
