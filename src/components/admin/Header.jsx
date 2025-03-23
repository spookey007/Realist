import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

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
  useMediaQuery,
} from "@mui/material";
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@mui/material/styles";

const Header = ({ toggleSidebar }) => {
  const { logout,user } = useAuth();
  
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect screen width for responsive design
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
    logout(); // Call context logout to clear user and token
    setOpenLogoutDialog(false); // Close dialog
    navigate("/"); // Redirect to login or home
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
          'z-index':"40",
        }}
      >
        <Toolbar className="flex justify-between items-center">
          {/* Sidebar Toggle Button */}
          <IconButton color="inherit" edge="start" onClick={toggleSidebar} className="md:hidden" sx={{ mr: 2 }}>
            <Bars3Icon className="h-6 w-6 text-white" />
          </IconButton>
          
          {/* Center Section: Search (Hidden on very small screens) */}
          {!isMobile && (
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 w-full max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
              <InputBase
                placeholder="Search..."
                className="text-black w-full pl-2"
                sx={{
                  color: "black",
                  "&::placeholder": { color: "black" },
                }}
              />
            </div>
          )}
          {/* Right Section: Notifications + User Avatar */}
          <div className="flex items-center gap-4">
            {/* Search Icon for Mobile */}
            {isMobile && (
              <IconButton color="inherit">
                <MagnifyingGlassIcon className="h-6 w-6 text-black" />
              </IconButton>
            )}

            {/* Notification Bell */}
            <IconButton color="inherit">
              <Badge badgeContent={user.notifications} color="error">
                <BellIcon className="h-6 w-6 text-black" />
              </Badge>
            </IconButton>

            {/* User Avatar */}
            <Avatar
              sx={{ bgcolor: "primary.main", cursor: "pointer" }}
              onClick={handleAvatarClick}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            {/* Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem disabled>{user.name}</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
