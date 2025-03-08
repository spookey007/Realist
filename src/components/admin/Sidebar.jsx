import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Toolbar,
} from "@mui/material";
import { ExpandLess, ExpandMore, ExitToApp } from "@mui/icons-material";
import {
  HomeIcon, UsersIcon, CogIcon, ChartBarIcon, Bars3Icon,
  FolderIcon, BellIcon, DocumentTextIcon, ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const drawerWidth = 240;

// Mapping API icon names to actual components
const iconMap = {
  Dashboard: HomeIcon,
  Group: UsersIcon,
  Settings: CogIcon,
  ChartBarIcon: ChartBarIcon,
  Menu: FolderIcon,
  UserIcon: UsersIcon,
  ExitToApp: ExitToApp,
};

const Sidebar = ({ open, toggleSidebar, startLoading }) => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [openSubMenus, setOpenSubMenus] = useState({});

  // Fetch and structure menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`);
        const structuredMenu = structureMenu(response.data);
        setMenuItems(structuredMenu);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Convert flat menu into parent-child hierarchy
  const structureMenu = (menuList) => {
    const menuMap = {};
    menuList.forEach(menu => {
      menuMap[menu.id] = { ...menu, subMenu: [] };
    });

    const rootMenus = [];
    menuList.forEach(menu => {
      if (menu.parent_menu_id) {
        menuMap[menu.parent_menu_id]?.subMenu.push(menuMap[menu.id]);
      } else {
        rootMenus.push(menuMap[menu.id]);
      }
    });

    return rootMenus.sort((a, b) => a.position - b.position);
  };

  // Toggle submenu visibility
  const toggleSubMenu = (menuId) => {
    setOpenSubMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
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
          backgroundColor: "#1E293B",
          color: "white",
        },
      }}
    >
      <Toolbar className="flex justify-between p-3">
        <IconButton onClick={toggleSidebar}>
          <Bars3Icon className="h-6 w-6 text-white" />
        </IconButton>
      </Toolbar>

      <List>
        {menuItems.map(menu => (
          <React.Fragment key={menu.id}>
            <ListItem
              button
              component={menu.subMenu.length ? "div" : Link}
              to={menu.subMenu.length ? "#" : menu.href}
              onClick={menu.subMenu.length ? () => toggleSubMenu(menu.id) : startLoading}
              sx={{
                color: location.pathname === menu.href ? "white" : "#CBD5E1",
                backgroundColor: location.pathname === menu.href ? "#6366F1" : "transparent",
                "&:hover": { backgroundColor: "#334155", color: "white" },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === menu.href ? "white" : "#93C5FD" }}>
                {iconMap[menu.icon] ? React.createElement(iconMap[menu.icon], { className: "h-6 w-6" }) : null}
              </ListItemIcon>
              {open && <ListItemText primary={menu.name} />}
              {menu.subMenu.length > 0 && (openSubMenus[menu.id] ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>

            {/* Render Submenu */}
            {menu.subMenu.length > 0 && (
              <Collapse in={openSubMenus[menu.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.subMenu.map(sub => (
                    <ListItem
                      button
                      key={sub.id}
                      component={Link}
                      to={sub.href}
                      onClick={startLoading}
                      sx={{
                        pl: open ? 4 : 2,
                        color: location.pathname === sub.href ? "white" : "#CBD5E1",
                        backgroundColor: location.pathname === sub.href ? "#6366F1" : "transparent",
                        "&:hover": { backgroundColor: "#334155", color: "white" },
                      }}
                    >
                      <ListItemIcon sx={{ color: location.pathname === sub.href ? "white" : "#93C5FD" }}>
                        {iconMap[sub.icon] ? React.createElement(iconMap[sub.icon], { className: "h-6 w-6" }) : null}
                      </ListItemIcon>
                      {open && <ListItemText primary={sub.name} />}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
