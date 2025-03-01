// src/components/admin/Sidebar.jsx
import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Dashboard, CalendarToday, Person, Contacts, Assessment, ExitToApp, Menu, ExpandLess, ExpandMore, Group, Settings } from "@mui/icons-material";
import { HomeIcon, UserIcon, ChartBarIcon, CogIcon, ArrowLeftOnRectangleIcon, Bars3Icon, UserGroupIcon } from "@heroicons/react/24/outline";

const drawerWidth = 240;

const Sidebar = ({ open, toggleSidebar, startLoading }) => {
  const location = useLocation();
  const [openManagement, setOpenManagement] = useState(false);

  const toggleManagement = () => {
    setOpenManagement(!openManagement);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 70,
          transition: "width 0.3s ease-in-out",
          backgroundColor: "#1E293B", // Sidebar Background
          color: "white",
          boxShadow: open ? "4px 0px 10px rgba(0, 0, 0, 0.1)" : "none",
        },
      }}
    >
      {/* Sidebar Toggle Button */}
      <Toolbar className="flex justify-between p-3">
        <IconButton onClick={toggleSidebar}>
          <Bars3Icon className="h-6 w-6 text-white" />
        </IconButton>
      </Toolbar>

      <List>
        {/* Dashboard Link */}
        <ListItem
          button
          component={Link}
          to="/admin/dashboard"
          onClick={startLoading}
          sx={{
            color: location.pathname === "/admin/dashboard" ? "white" : "#CBD5E1",
            backgroundColor: location.pathname === "/admin/dashboard" ? "#6366F1" : "transparent",
            "&:hover": { backgroundColor: "#334155", color: "white" },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === "/admin/dashboard" ? "white" : "#93C5FD" }}>
            <Dashboard />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItem>

        {/* Management (Collapsible Submenu) */}
        <ListItem button onClick={toggleManagement} sx={{ "&:hover": { backgroundColor: "#334155" } }}>
          <ListItemIcon sx={{ color: "#93C5FD" }}>
            <Group />
          </ListItemIcon>
          {open && <ListItemText primary="Management" />}
          {openManagement ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openManagement} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Users */}
            <ListItem
              button
              component={Link}
              to="/admin/users"
              onClick={startLoading}
              sx={{
                pl: open ? 4 : 2,
                color: location.pathname === "/admin/users" ? "white" : "#CBD5E1",
                backgroundColor: location.pathname === "/admin/users" ? "#6366F1" : "transparent",
                "&:hover": { backgroundColor: "#334155", color: "white" },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === "/admin/users" ? "white" : "#93C5FD" }}>
                <UserIcon className="h-6 w-6" />
              </ListItemIcon>
              {open && <ListItemText primary="Users" />}
            </ListItem>

            {/* Roles */}
            <ListItem
              button
              component={Link}
              to="/admin/roles"
              onClick={startLoading}
              sx={{
                pl: open ? 4 : 2,
                color: location.pathname === "/admin/roles" ? "white" : "#CBD5E1",
                backgroundColor: location.pathname === "/admin/roles" ? "#6366F1" : "transparent",
                "&:hover": { backgroundColor: "#334155", color: "white" },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === "/admin/roles" ? "white" : "#93C5FD" }}>
                <Settings />
              </ListItemIcon>
              {open && <ListItemText primary="Roles" />}
            </ListItem>

            {/* Invite Users */}
            <ListItem
              button
              component={Link}
              to="/admin/invites"
              onClick={startLoading}
              sx={{
                pl: open ? 4 : 2,
                color: location.pathname === "/admin/invites" ? "white" : "#CBD5E1",
                backgroundColor: location.pathname === "/admin/invites" ? "#6366F1" : "transparent",
                "&:hover": { backgroundColor: "#334155", color: "white" },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === "/admin/invites" ? "white" : "#93C5FD" }}>
                <UserGroupIcon className="h-6 w-6" />
              </ListItemIcon>
              {open && <ListItemText primary="Invite Users" />}
            </ListItem>
          </List>
        </Collapse>

        {/* Reports Link */}
        <ListItem
          button
          component={Link}
          to="/admin/reports"
          onClick={startLoading}
          sx={{
            color: location.pathname === "/admin/reports" ? "white" : "#CBD5E1",
            backgroundColor: location.pathname === "/admin/reports" ? "#6366F1" : "transparent",
            "&:hover": { backgroundColor: "#334155", color: "white" },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === "/admin/reports" ? "white" : "#93C5FD" }}>
            <ChartBarIcon className="h-6 w-6" />
          </ListItemIcon>
          {open && <ListItemText primary="Reports" />}
        </ListItem>

        {/* Logout */}
        <ListItem
          button
          component={Link}
          to="/admin/logout"
          onClick={startLoading}
          sx={{
            color: location.pathname === "/admin/logout" ? "white" : "#CBD5E1",
            backgroundColor: location.pathname === "/admin/logout" ? "#6366F1" : "transparent",
            "&:hover": { backgroundColor: "#334155", color: "white" },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === "/admin/logout" ? "white" : "#93C5FD" }}>
            <ExitToApp />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
