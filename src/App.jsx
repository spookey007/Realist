import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import NotFound from './components/NotFound';
import ModalProvider from './components/ModalProvider';

import { ThemeProvider } from './context/ThemeContext';
import { DeviceProvider } from './context/DeviceContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';

import { ToastContainer } from 'react-toastify';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
window.alertify = alertify;

import FullPageLoader from './components/FullPageLoader';

import ClerkSyncHandler from "./components/ClerkSyncHandler";

import GoogleCallback from "./components/GoogleCallback";
import SsoCallback from './components/SsoCallback';

import { useAuth } from "../src/context/AuthContext"; 

const App = () => {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoader();
  const { user } = useAuth();
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [setIsLoading]);

  if (isLoading) return null;

  const InvitePage = ({ params }) => {
    // If the user is logged in, redirect to another page (e.g., dashboard)
    if (user) {
      navigate("/dashboard", { replace: true });
      return null; // Avoid rendering the Invite page
    }

    // If not logged in, render the Invite page
    return <Invite {...params} />;
  };
  return (
    <div className="flex flex-col min-h-screen">

      <Header />
      <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invite/:id" element={<InvitePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route path="/sso-callback" element={<SsoCallback />} />

            <Route path="/*" element={
                <AdminRoutes />
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </LoaderProvider>
      </DeviceProvider>
    </ThemeProvider>
  </Provider>
);

export default AppWrapper;
