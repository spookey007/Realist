import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import { useDevice } from "../../context/DeviceContext";



const AdminLayout = ({ children, sidebarOpen, toggleSidebar, startLoading, isLoading, currentSidebarWidth }) => {
  const { isMobile } = useDevice();
  return (
    <div className="relative flex h-screen">
      {/* Overlay for mobile (Only shows when sidebar is open) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile ? "fixed inset-y-0 left-0 w-[70%] max-w-[300px] z-30" : "relative"
        } transition-all duration-300`}
        style={{
          width: isMobile ? (sidebarOpen ? "70%" : "0") : `${currentSidebarWidth}px`,
        }}
      >
        <Sidebar
          openSidebar={sidebarOpen}
          toggleSidebar={toggleSidebar}
          startLoading={startLoading}
        />
      </div>

      {/* Main Content */}
      <div
        className={`relative flex flex-col flex-1 transition-all duration-300 ${
          isMobile ? "w-full" : ""
        }`}
        style={{
          marginLeft: isMobile ? "0" : `${currentSidebarWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${currentSidebarWidth}px)`,
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-y-auto mt-[64px]">{children}</main>
        <Footer />
      </div>

      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AdminLayout;
