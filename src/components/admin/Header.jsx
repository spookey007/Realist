import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  InputBase,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

let userData = JSON.parse(localStorage.getItem("user")) || { name: "Guest", notifications: 0 };
console.log(userData)
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Open dropdown menu
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Show confirmation dialog
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    handleCloseMenu();
  };

  // Logout user
  const handleConfirmLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setOpenLogoutDialog(false);
    navigate("/"); // Redirect to home/login page
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
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
                <BellIcon className="h-6 w-6 text-black" />
              </Badge>
            </IconButton>

            {/* User Avatar with Dropdown */}
            <Avatar
              sx={{ bgcolor: "primary.main", cursor: "pointer" }}
              onClick={handleAvatarClick}
            >
              {userData.name.charAt(0)}
            </Avatar>

            {/* Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem disabled>{userData.name}</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
