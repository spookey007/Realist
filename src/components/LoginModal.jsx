import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import '../assets/css/modal.css';
import backgroundImg from '../assets/images/contact_form/contact_form.jpeg';
import { useAuth } from '../context/AuthContext'; // Import context
import { useLoader } from "../context/LoaderContext";
import { motion, AnimatePresence } from "framer-motion";
// import { useSignIn } from "@clerk/clerk-react";
import { useUser, useSignIn } from "@clerk/clerk-react";


const now = new Date();
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const LoginModal = ({ isOpen, closeModal,Method }) => {
  const isSignIn = Method  === 1;
  const navigate = useNavigate();
  const [selectedDateTime, setSelectedDateTime] = useState(startOfToday);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const recaptchaRef = useRef();
  const { login,logout } = useAuth();
  const { setIsLoading } = useLoader();
  const [selectedRole, setSelectedRole] = useState("Contractor");
  // const { signIn } = useSignIn();
  const { signIn, isLoaded } = useSignIn();
  const { user, isSignedIn } = useUser();
  const { setUser } = useAuth();

  
  const handleGoogleClick = async () => {
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
  
    try {
      await signIn
        .authenticateWithRedirect({
          strategy: 'oauth_google', // or "oauth_facebook" for Facebook
          redirectUrl: '/sso-callback',
          redirectUrlComplete: `${window.location.origin}/`,
        })
        .then((res) => {
          console.log("✅ Clerk redirect initiated:", res);
        })
        .catch((err) => {
          console.log("❌ Clerk OAuth Error:", err?.errors);
          console.error("OAuth Sign-in failed:", err);
          setIsLoading(false);
        });
    } catch (err) {
      console.error("Google login failed:", err);
      setIsLoading(false);
    }
  };
  

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
    address: '',
    dateTime: null,
    captchaValue: '',
  };

  const validationSchema = Yup.object({
    // name: Yup.string().required('Name is required'),
    email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),

    // phone: Yup.string().required('Phone number is required'),
    // message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters long'),
    // address: Yup.string().required('Address is required'),
    // dateTime: Yup.date().required('Please select a date and time').min(startOfToday, 'Date must be today or later'),
    captchaValue: Yup.string().required('Please complete the reCAPTCHA'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    let data
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...values, 
          dateTime: selectedDateTime,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      data = await response.json();
      if (response.ok) {
        // alertify.success('User login successful!');
  
        login(data.user, data.token); // ✅ Call context login to set user globally
        resetForm();
        // console.log(recaptchaRef);
        // recaptchaRef.current.reset();
        closeModal();
        setTimeout(() => {
          setIsLoading(false);
          closeModal();
          navigate("/dashboard");
        }, 100);
      } else {
        alertify.error('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      alertify.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // alertify.error('Unable to access your location. Falling back to IP-based location.');
          // fetchIPBasedLocation();
        }
      );
    } else {
      fetchIPBasedLocation();
    }
  };

  const fetchIPBasedLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error) {
      // alertify.error('Unable to fetch location based on IP address.');
    }
  };

  // useEffect(() => {
  //   fetchLocation();
  // }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isSignIn ? "Welcome Back" : "Join Our Network"}
                </h2>
                <p className="text-white/70 mb-8">
                  {isSignIn ? "Sign in to access your professional dashboard" : "Create an account to get started"}
                </p>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-6">
                      {/* Email Field */}
                      {isSignIn && (
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-white/90">
                            Email
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-400 text-sm" />
                        </div>
                      )}

                      {/* Password Field */}
                      {isSignIn && (
                        <div className="space-y-2">
                          <label htmlFor="password" className="block text-sm font-medium text-white/90">
                            Password
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                          />
                          <ErrorMessage name="password" component="div" className="text-red-400 text-sm" />
                        </div>
                      )}

                      {/* ReCAPTCHA */}
                      {isSignIn && (
                        <div className="space-y-2">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={(value) => setFieldValue('captchaValue', value)}
                            className="flex justify-center"
                          />
                          <ErrorMessage name="captchaValue" component="div" className="text-red-400 text-sm" />
                        </div>
                      )}

                      {/* Submit Button */}
                      {isSignIn && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                            ${isSubmitting
                              ? 'bg-cyan-600/50 text-white/70 cursor-not-allowed'
                              : 'bg-cyan-600 text-white hover:bg-cyan-500 active:bg-cyan-600'
                            }`}
                        >
                          {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                      )}
                    </Form>
                  )}
                </Formik>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900/95 text-white/70">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleClick}
                  className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white rounded-lg py-3 px-4 transition-all duration-200 border border-white/10"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="font-medium">
                    {isSignIn ? "Sign in with Google" : "Sign up with Google"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
