import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { HomeIcon, UsersIcon, CogIcon, ChartBarIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/images/slate-R-logo.svg"; // Fixed import

const drawerWidth = 280;
const drawerCollapsedWidth = 1;
const drawerCollapsedWidth1 = 70;

const iconMap = {
  Dashboard: HomeIcon,
  Group: UsersIcon,
  Settings: CogIcon,
  ChartBar: ChartBarIcon,
  Menu: FolderIcon,
};

const Sidebar = ({ startLoading }) => {
  const { user } = useAuth();
  
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screen

  const [menuItems, setMenuItems] = useState([]);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [openSidebar, setOpenSidebar] = useState(!isMobile); // Initially open for desktop, closed for mobile

  // Toggle Sidebar state
  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  useEffect(() => {
    setOpenSidebar(!isMobile); // Adjust sidebar on screen resize
  }, [isMobile]);

  const fetchMenuFromAPI = async (role_id) => {
    // console.log('api')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/getMenusSidebar`, {
        params: { role_id },
      });
      const structured = structureMenu(response.data);
      setMenuItems(structured);
      localStorage.setItem(`menu`, JSON.stringify(structured)); // Cache menu for role
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      const cachedMenu = localStorage.getItem(`menu`);
      if (cachedMenu) {
        setMenuItems(JSON.parse(cachedMenu));
      } else {
        fetchMenuFromAPI(user.role);
      }
    }
  }, [user?.role]); // Fetch when user role is available

  const structureMenu = (menuList) => {
    const menuMap = {};
    menuList.forEach((menu) => (menuMap[menu.id] = { ...menu, subMenu: [] }));
    const rootMenus = [];
    menuList.forEach((menu) => {
      if (menu.parent_menu_id) {
        menuMap[menu.parent_menu_id]?.subMenu.push(menuMap[menu.id]);
      } else {
        rootMenus.push(menuMap[menu.id]);
      }
    });
    return rootMenus.sort((a, b) => a.position - b.position);
  };

  const toggleSubMenu = (menuId) => {
    setOpenSubMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <motion.div
      initial={{ width: openSidebar ? drawerWidth : drawerCollapsedWidth }}
      animate={{ width: openSidebar ? drawerWidth : drawerCollapsedWidth }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col"
    >
      <Drawer
        variant="permanent"
        sx={{
          width: openSidebar ? drawerWidth : drawerCollapsedWidth1,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: openSidebar ? drawerWidth : drawerCollapsedWidth1,
            transition: "width 0.3s ease-in-out",
            backgroundColor: "#ffffff",
            color: "#1E293B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* Logo */}
        <div className="flex justify-center p-4">
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </div>

        {/* Menu Items */}
        <List className="flex-grow">
          {menuItems.map((menu) => (
            <React.Fragment key={menu.id}>
              <ListItem
                button
                component={menu.subMenu.length ? "div" : Link}
                to={menu.subMenu.length ? "#" : menu.href}
                onClick={menu.subMenu.length ? () => toggleSubMenu(menu.id) : startLoading}
                sx={{
                  color: location.pathname === menu.href ? "rgb(55 48 163 / var(--tw-text-opacity))" : "#1E293B",
                  backgroundColor: location.pathname === menu.href ? "rgb(224 231 255/var(--tw-bg-opacity))" : "transparent",
                  "&:hover": { backgroundColor: "#E5E7EB", color: "#1E293B" },
                  borderRadius: "10px",
                  margin: "5px 10px",
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === menu.href ? "rgb(55 48 163 / var(--tw-text-opacity))" : "#64748B" }}>
                  {iconMap[menu.icon] ? React.createElement(iconMap[menu.icon], { className: "h-6 w-6" }) : null}
                </ListItemIcon>
                {openSidebar && <ListItemText primary={menu.name} />}
                {menu.subMenu.length > 0 && (openSubMenus[menu.id] ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {/* Submenu */}
              {menu.subMenu.length > 0 && (
                <Collapse in={openSubMenus[menu.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.subMenu.map((sub) => (
                      <ListItem
                        button
                        key={sub.id}
                        component={Link}
                        to={sub.href}
                        onClick={startLoading}
                        sx={{
                          pl: openSidebar ? 4 : 2,
                          color: location.pathname === sub.href ? "rgb(55 48 163 / var(--tw-text-opacity))" : "#1E293B",
                          backgroundColor: location.pathname === sub.href ? "rgb(224 231 255/var(--tw-bg-opacity))" : "transparent",
                          "&:hover": { backgroundColor: "#E5E7EB", color: "#1E293B" },
                          borderRadius: "8px",
                          margin: "3px 15px",
                        }}
                      >
                        <ListItemIcon sx={{ color: location.pathname === sub.href ? "rgb(55 48 163 / var(--tw-text-opacity))" : "#64748B" }}>
                          {iconMap[sub.icon] ? React.createElement(iconMap[sub.icon], { className: "h-5 w-5" }) : null}
                        </ListItemIcon>
                        {openSidebar && <ListItemText primary={sub.name} />}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Bottom Toggle Button */}
        <div className="p-3">
          <Divider />
          <div className="flex justify-center p-3 cursor-pointer" onClick={toggleSidebar}>
            <div className="grid size-10 place-content-center text-lg">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSidebar ? "rotate-180" : ""}`}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </div>
            {openSidebar && <span className="text-xs font-medium p-3">Hide</span>}
          </div>
        </div>
      </Drawer>
    </motion.div>
  );
};

export default Sidebar;
