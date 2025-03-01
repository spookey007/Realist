// src/components/admin/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner"; // Import loading animation

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading for 1 second
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {isLoading && <LoadingSpinner />} {/* Show loading animation */}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} startLoading={startLoading} />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-y-auto mt-[64px]">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
