import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Invite from './components/Invite';
import LoginPage from './components/admin/Login';
import AdminRoutes from './components/admin/routes/AdminRoutes';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './components/NotFound';
import ModalProvider from './components/ModalProvider';

import { ThemeProvider } from './context/ThemeContext';
import { DeviceProvider } from './context/DeviceContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

import FullPageLoader from './components/FullPageLoader';

import ClerkSyncHandler from "./components/ClerkSyncHandler";
import GoogleCallback from "./components/GoogleCallback";

window.alertify = alertify;

const App = () => {
  const { isLoading, setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col min-h-screen">

      <Header />
      <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invite/:id" element={<Invite />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
      <Footer />
      <ModalProvider />
    </div>
  );
};
const AppWrapper = () => (
  <Provider store={store}>
    <ThemeProvider>
      <DeviceProvider>
        <LoaderProvider>
          <FullPageLoader />
          <App />
        </LoaderProvider>
      </DeviceProvider>
    </ThemeProvider>
  </Provider>
);

export default AppWrapper;
