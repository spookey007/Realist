import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

const drawerWidth = 280;
const drawerCollapsedWidth = 1;
const drawerCollapsedWidth1 = 70;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // simulate loading
  };

  const currentSidebarWidth = sidebarOpen ? drawerCollapsedWidth1 : drawerCollapsedWidth1;

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {isLoading && <LoadingSpinner />}

      {/* Sidebar */}
      <Sidebar
        openSidebar={sidebarOpen}
        toggleSidebar={toggleSidebar}
        startLoading={startLoading}
      />

      {/* Main Content */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: currentSidebarWidth,
          width: `calc(100% - ${currentSidebarWidth}px)`,
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-y-auto mt-[64px]">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
