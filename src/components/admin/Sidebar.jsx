import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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

import {
  HiHome,
  HiUser,
  HiCog,
  HiChartBar,
  HiInbox,
  HiBell,
  HiDocumentText,
  HiFolder,
  HiHeart,
  HiShoppingCart,
  HiUsers,
  HiArrowRightOnRectangle,
  HiCalendar,
  HiBars3,
  HiChevronUp,
  HiChevronDown,
  HiChevronDoubleRight,
  HiUserPlus,
  HiSquaresPlus,
  HiOutlineEquals,
  HiRectangleStack,
  HiDocumentCheck
} from "react-icons/hi2";

import { useTheme } from "@mui/material/styles";
import logo from "../../assets/images/slate-R-logo.png"; // Fixed import
import { useDevice } from "../../context/DeviceContext";

const drawerWidth = 280;
const drawerCollapsedWidth1 = 70;

const Sidebar = ({ startLoading }) => {
  const { user } = useAuth();
  const [iconMap, setIconMap] = useState({});
  const location = useLocation();
  const theme = useTheme();
  const { isMobile } = useDevice();
  const [menuItems, setMenuItems] = useState([]);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [openSidebar, setOpenSidebar] = useState(!isMobile); // Initially open for desktop, closed for mobile

  // Toggle Sidebar state
  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  useEffect(() => {
    setOpenSidebar(!isMobile); // Adjust sidebar on screen resize
  }, [isMobile]);

  // Define a fallback default icon
  const defaultIcon = HiFolder;

  const availableIcons = {
    HiHome,
    HiBars3,
    HiUsers,
    HiCog,
    HiUserPlus,
    HiSquaresPlus,
    HiChartBar,
    HiArrowRightOnRectangle,
    HiOutlineEquals,
    HiRectangleStack,
    HiDocumentCheck,
  };

  useEffect(() => {
    setOpenSidebar(!isMobile);
  }, [isMobile]);

  const generateIconMap = (menuList) => {
    const newIconMap = {};

    const traverseMenu = (menu) => {
      newIconMap[menu.name] = availableIcons[menu.icon] || HiFolder;
      if (menu.subMenu && menu.subMenu.length > 0) {
        menu.subMenu.forEach(traverseMenu);
      }
    };

    menuList.forEach(traverseMenu);
    return newIconMap;
  };

  const fetchMenuFromAPI = async (role_id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/menu/getMenusSidebar`,
        { params: { role_id } }
      );

      const structured = structureMenu(response.data);
      setMenuItems(structured);
      setIconMap(generateIconMap(response.data));
      localStorage.setItem("menu", JSON.stringify(structured));
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      const cachedMenu = localStorage.getItem("menu");
      if (cachedMenu) {
        const parsedMenu = JSON.parse(cachedMenu);
        setMenuItems(parsedMenu);
        setIconMap(generateIconMap(parsedMenu));
      } else {
        fetchMenuFromAPI(user.role);
      }
    }
  }, [user?.role]);

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

  // Render Desktop Sidebar remains as is
  const renderDesktopSidebar = () => (
    <motion.div
      initial={{ width: openSidebar ? drawerWidth : drawerCollapsedWidth1 }}
      animate={{ width: openSidebar ? drawerWidth : drawerCollapsedWidth1 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col"
    >
      <Drawer
        variant="permanent"
        sx={{
          width: openSidebar ? drawerWidth : drawerCollapsedWidth1,
          flexShrink: 0,
          overflow: "hidden", // Prevents auto-scroll
          "& .MuiDrawer-paper": {
            width: openSidebar ? drawerWidth : drawerCollapsedWidth1,
            transition: "width 0.3s ease-in-out",
            backgroundColor: "#ffffff",
            color: "#1E293B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden", // Ensures no scrolling inside the drawer
            whiteSpace: "nowrap", // Prevents text from causing overflow
            'z-index':"41",
          },
        }}
      >
        {/* Logo */}
        <div className="flex justify-center p-4">
          <img src={logo} alt="Logo" className="h-14 w-14" />
        </div>

        {/* Menu Items */}
        <List className="flex-grow">
          {menuItems.map((menu) => (
            <React.Fragment key={menu.id}>
              <ListItem
                button
                component={menu.subMenu.length ? "div" : Link}
                to={menu.subMenu.length ? "#" : menu.href}
                onClick={
                  menu.subMenu.length ? () => toggleSubMenu(menu.id) : startLoading
                }
                sx={{
                  color:
                    location.pathname === menu.href
                      ? "rgb(55 48 163 / var(--tw-text-opacity))"
                      : "#1E293B",
                  backgroundColor:
                    location.pathname === menu.href ? "lavender" : "transparent",
                  "&:hover": { backgroundColor: "#E5E7EB", color: "#1E293B" },
                  borderRadius: "10px",
                  margin: "5px 10px",
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === menu.href
                        ? "rgb(55 48 163 / var(--tw-text-opacity))"
                        : "#64748B",
                  }}
                >
                  {iconMap[menu.name]
                    ? React.createElement(iconMap[menu.name], {
                        className: "h-6 w-6",
                      })
                    : <HiFolder className="h-6 w-6" />}
                </ListItemIcon>
                {openSidebar && <ListItemText primary={menu.name} />}
                {menu.subMenu.length > 0 &&
                  (openSubMenus[menu.id] ? (
                    <HiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <HiChevronDown className="h-5 w-5 text-gray-500" />
                  ))}
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
                          color:
                            location.pathname === sub.href
                              ? "rgb(55 48 163 / var(--tw-text-opacity))"
                              : "#1E293B",
                          backgroundColor:
                            location.pathname === sub.href ? "lavender" : "transparent",
                          "&:hover": { backgroundColor: "#E5E7EB", color: "#1E293B" },
                          borderRadius: "8px",
                          margin: "3px 15px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color:
                              location.pathname === sub.href
                                ? "rgb(55 48 163 / var(--tw-text-opacity))"
                                : "#64748B",
                          }}
                        >
                          {iconMap[sub.name]
                            ? React.createElement(iconMap[sub.name], {
                                className: "h-5 w-5",
                              })
                            : <HiFolder className="h-5 w-5" />}
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
          <div
            className="flex justify-center p-3 cursor-pointer"
            onClick={toggleSidebar}
          >
            <div className="grid size-10 place-content-center text-lg">
              <HiChevronDoubleRight
                className={`h-5 w-5 transition-transform ${
                  openSidebar ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSidebar && <span className="text-xs font-medium p-3">Hide</span>}
          </div>
        </div>
      </Drawer>
    </motion.div>
  );

  // Render Mobile Sidebar - Updated for a compact bottom navigation
  const renderMobileSidebar = () => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(null);

    const toggleSubMenu = (menuId) => {
      setOpenMenu(openMenu === menuId ? null : menuId);
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-50 border-t border-gray-300">
        <List className="flex justify-around items-center px-1 py-1">
          {menuItems.map((menu) => (
            <React.Fragment key={menu.id}>
              {/* Main Menu Item */}
              <ListItem
                button
                component={menu.subMenu.length ? "div" : Link}
                to={menu.subMenu.length ? "#" : menu.href}
                onClick={
                  menu.subMenu.length ? () => toggleSubMenu(menu.id) : startLoading
                }
                className="flex flex-col items-center justify-center w-full max-w-[60px] py-1 relative"
                sx={{
                  color:
                    location.pathname === menu.href
                      ? "rgb(55 48 163 / var(--tw-text-opacity))"
                      : "#334155",
                  backgroundColor:
                    location.pathname === menu.href ? "#E5E7EB" : "transparent",
                  "&:hover": { backgroundColor: "#F3F4F6", color: "#1E293B" },
                  borderRadius: "8px",
                  padding: "4px",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <ListItemIcon
                    className="flex items-center justify-center"
                    sx={{
                      color:
                        location.pathname === menu.href
                          ? "rgb(55 48 163 / var(--tw-text-opacity))"
                          : "#64748B",
                      minWidth: "auto",
                      fontSize: "1.25rem",
                    }}
                  >
                    {iconMap[menu.name]
                      ? React.createElement(iconMap[menu.name], {
                          className: "h-5 w-5",
                        })
                      : <HiFolder className="h-5 w-5" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={menu.name}
                    className="text-[10px] text-center mt-1 font-medium text-gray-600"
                  />
                </div>
              </ListItem>

              {/* Horizontal Submenu (Opens Below Main Menu) */}
              {menu.subMenu.length > 0 && openMenu === menu.id && (
                <div className="absolute bottom-full left-0 w-full bg-white shadow-md border-t border-gray-300">
                  <List className="flex justify-center gap-1 px-2 py-1">
                    {menu.subMenu.map((sub) => (
                      <ListItem
                        button
                        key={sub.id}
                        component={Link}
                        to={sub.href}
                        onClick={startLoading}
                        className="flex flex-col items-center justify-center w-[50px] py-1"
                        sx={{
                          color:
                            location.pathname === sub.href
                              ? "rgb(55 48 163 / var(--tw-text-opacity))"
                              : "#334155",
                          backgroundColor:
                            location.pathname === sub.href ? "#E5E7EB" : "transparent",
                          "&:hover": { backgroundColor: "#F3F4F6", color: "#1E293B" },
                          borderRadius: "8px",
                          padding: "4px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ListItemIcon
                            className="flex items-center justify-center"
                            sx={{
                              color:
                                location.pathname === sub.href
                                  ? "rgb(55 48 163 / var(--tw-text-opacity))"
                                  : "#64748B",
                              minWidth: "auto",
                              fontSize: "1rem",
                            }}
                          >
                            {iconMap[sub.name]
                              ? React.createElement(iconMap[sub.name], {
                                  className: "h-4 w-4",
                                })
                              : <HiFolder className="h-4 w-4" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={sub.name}
                            className="text-[8px] text-center mt-1 font-medium text-gray-600"
                          />
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
              )}
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  };

  return isMobile ? renderMobileSidebar() : renderDesktopSidebar();
};

export default Sidebar;
