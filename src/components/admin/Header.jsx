// src/components/admin/Header.jsx
import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, InputBase } from "@mui/material";
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

let userData = JSON.parse(localStorage.getItem("user")) || { name: "Guest", notifications: 0 };

const Header = ({ toggleSidebar }) => {
  return (
    <AppBar
      position="fixed"
      className="transition-all"
      sx={{
        width: "100%",
        backgroundColor: "#ffffff", // Updated header color (Dark Gray)
        color: "white",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar className="flex justify-between items-center">
        {/* Sidebar Toggle Button */}
        <IconButton color="inherit" edge="start" onClick={toggleSidebar} className="md:hidden" sx={{ mr: 2 }}>
          <Bars3Icon className="h-6 w-6 text-white" />
        </IconButton>

        {/* Search Bar */}
        <Box className="flex items-center bg-gray-100 rounded-lg px-3 py-1 w-full max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
          <InputBase
            placeholder="Search..."
            className="text-black w-full pl-2"
            sx={{
              color: "black",
              "&::placeholder": { color: "black" },
            }}
          />
        </Box>

        {/* Right Side User Info & Notifications */}
        <Box className="flex items-center space-x-4">
          <IconButton color="inherit">
            <Badge badgeContent={userData.notifications} color="error">
              <BellIcon className="h-6 w-6 text-white" />
            </Badge>
          </IconButton>

          <Avatar sx={{ bgcolor: "primary.main" }}>
            {userData.name.charAt(0)}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
