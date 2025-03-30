import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './redux/store'; // Import Redux store
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Invite from './components/Invite';
import LoginPage from './components/admin/Login';
import AdminRoutes from './components/admin/routes/AdminRoutes';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './components/NotFound'; // Example 404 page
import ModalProvider from './components/ModalProvider'; // Import ModalProvider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { DeviceProvider } from "./context/DeviceContext";

window.alertify = alertify;

const App = () => {
  const location = useLocation(); // Now safe to use

  const [adminPaths, setAdminPaths] = useState([]);

  useEffect(() => {
    // Get admin routes from localStorage
    const storedMenu = localStorage.getItem("menu");
    if (storedMenu) {
      try {
        const menuData = JSON.parse(storedMenu);
        const paths = extractPaths(menuData);
        setAdminPaths(paths);
      } catch (error) {
        console.error("Failed to parse menu from localStorage:", error);
      }
    }
  }, []);

  // Function to extract all admin route paths from menu data
  const extractPaths = (menuData) => {
    let paths = [];
    menuData.forEach(menuItem => {
      paths.push(menuItem.href); // Add main menu item path
      if (menuItem.subMenu && menuItem.subMenu.length > 0) {
        menuItem.subMenu.forEach(subItem => paths.push(subItem.href)); // Add sub-menu item paths
      }
    });
    return paths;
  };

  // Check if the current route is an admin route
  const isAdminRoute = adminPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Wrap Header with AnimatePresence */}
      <AnimatePresence>
        {!isAdminRoute && <Header key="header" />}
      </AnimatePresence>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          {/* <Route path="/services" element={<Services />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/invite/:id" element={<Invite />} />
          <Route path="/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
      <ModalProvider />
    </div>
  );
};

const AppWrapper = () => (
  <Provider store={store}>
    <ThemeProvider>
      <DeviceProvider>
        <Router>
          <App />
        </Router>
      </DeviceProvider>
    </ThemeProvider>
  </Provider>
);

export default AppWrapper;