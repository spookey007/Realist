import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Videos from './components/Videos';
import Invite from './components/Invite';
import LoginPage from './components/admin/Login';
import AdminRoutes from './components/admin/routes/AdminRoutes';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './components/NotFound'; // Example 404 page
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
  const location = useLocation();

  // Define routes where the footer and header should not be displayed
  const noFooterHeaderRoutes = ['/login'];

  // Check if the current location path matches any of the noFooterHeaderRoutes
  const isNoFooterHeader = noFooterHeaderRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render Header */}
      {!isNoFooterHeader && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/invite/:id" element={<Invite />} />
            {/* Protect all admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Conditionally render Footer */}
      {!isNoFooterHeader && <Footer />}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
