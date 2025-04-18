import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { openModal, closeModal } from "../../redux/modalSlice";
import MobileModal from "../modals/ServicesModal/MobileModal";
import DesktopModal from "../modals/ServicesModal/DesktopModal";
import ServiceTypeModal from "../modals/ServicesModal/ServiceTypeModal";
import WebListings from "../ui/Services/WebListings";
import MobileListings from "../ui/Services/MobileListings";
import { motion,AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";
import { useAuth } from '../../context/AuthContext';
import GuestForm from "./GuestForm"; 
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const Services = () => {

  const dispatch = useDispatch();
  const { isOpen, modalType, modalComponent } = useSelector((state) => state.modal);
  const [listingsData, setListingsData] = useState([]);
  const { isMobile, isTablet } = useDevice();
  const { user, menu } = useAuth();
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(user?.role === 0);
  const [countdown, setCountdown] = useState(10);
  const [isInRegistration, setIsInRegistration] = useState(false);
  
  // Role constants
  const ADMIN_ROLE = 1;
  const CONTRACTOR_ROLE = 3;
  const isAdmin = user?.role === ADMIN_ROLE;
  const isContractor = user?.role === CONTRACTOR_ROLE;
  const canEdit = [ADMIN_ROLE, CONTRACTOR_ROLE].includes(user?.role);


  const handleCloseDialog = () => {
    setisDialogOpen(false);
    setIsGuestFormOpen(true);
  };

  const handleBackDialog = () => {
    setIsGuestFormOpen(false);
    setisDialogOpen(true);
  };


  const handleOpenServiceModal = () => {
    const deviceType = isMobile || isTablet ? "mobile" : "desktop";
    dispatch(openModal({ modalType: deviceType, modalComponent: "Service" }));
  };

  const handleOpenServiceTypeModal = () => {
    dispatch(openModal({ modalType: "desktop", modalComponent: "ServiceType" }));
  };
  
  const fetchServices = async () => {
    try {
      const params = {};
  
      // If user has restricted role, only get active services
      if (![ADMIN_ROLE, CONTRACTOR_ROLE].includes(user?.role)) {
        params.status = 1;
      }
  
      // Only send userId for contractor role
      if (user?.role === CONTRACTOR_ROLE) {
        params.userId = user.id;
      }

      if (user?.role === 0) {
        params.user_limit = 3;
      }
  
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services`,
        { params }
      );
  
      // Handle the API response structure correctly
      const { servicesByType } = response.data;
      setListingsData(servicesByType || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      alertify.error("Failed to fetch services");
    }
  };

  // Only fetch on mount
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    const fetchData = async () => {
      if (!isMounted || hasFetched || !user?.id) return;
      hasFetched = true;
      await fetchServices();
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let timer;
    if (isDialogOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setisDialogOpen(false);
      setIsGuestFormOpen(false);
      setIsInRegistration(false);
    }
    return () => clearInterval(timer);
  }, [isDialogOpen, countdown]);

  const handleServiceSubmit = async (values) => {
    try {
      if (!user?.id) {
        alertify.error("User is not logged in.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/services`,
        {
          ...values,
          user_id: user.id,
        }
      );

      if (response.status === 201) {
        alertify.success("Service created successfully");
        dispatch(closeModal());
        fetchServices();
      } else {
        alertify.error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to create service:", error);
      alertify.error("Something went wrong");
    }
  };

  const handleServiceTypeSubmit = async (values) => {
    try {
      if (!user?.id) {
        alertify.error("User is not logged in.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service-types`,
        values
      );

      if (response.status === 201) {
        alertify.success("Service type created successfully");
        dispatch(closeModal());
        fetchServices();
      } else {
        alertify.error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to create service type:", error);
      alertify.error("Something went wrong");
    }
  };



  if (user && Array.isArray(menu)) {
    // For non-guest users (role != 0), show services directly
    if (user.role !== 0) {
      return (
        <div>
          {!isMobile ? (
            <div className="flex flex-wrap gap-3 mb-6 md:mb-0">
              {/* Add Service Button (Contractor) */}
              {isContractor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    onClick={handleOpenServiceModal}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-purple-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service
                  </button>
                </motion.div>
              )}
              
              {/* Add Service Type Button (Admin) */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    onClick={handleOpenServiceTypeModal}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-blue-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service Type
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="fixed bottom-[70px] left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col gap-3 shadow-lg md:hidden">
              {isContractor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <button
                    onClick={handleOpenServiceModal}
                    className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-purple-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service
                  </button>
                </motion.div>
              )}
              
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <button
                    onClick={handleOpenServiceTypeModal}
                    className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-blue-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service Type
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Modals */}
          {modalType === "mobile" && modalComponent === "Service" ? (
            <MobileModal
              onSubmit={handleServiceSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : modalType === "desktop" && modalComponent === "Service" ? (
            <DesktopModal
              onSubmit={handleServiceSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : modalType === "desktop" && modalComponent === "ServiceType" ? (
            <ServiceTypeModal
              onSubmit={handleServiceTypeSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : null}

          {/* Service Listings */}
          <div className="mt-0 mb-10">
            {isMobile ? (
              <MobileListings 
                listings={listingsData} 
                fetchServices={fetchServices} 
                canEdit={canEdit}
                isLocked={user?.role === 0}
              />
            ) : (
              <WebListings 
                listings={listingsData} 
                fetchServices={fetchServices} 
                canEdit={canEdit}
                isLocked={user?.role === 0}
              />
            )}
          </div>
        </div>
      );
    }

    // For guest users (role == 0)
    // Only show services when dialog is closed, guest form is closed, and not in registration
    if (!isDialogOpen && !isGuestFormOpen && !isInRegistration) {
      return (
        <div>
          {!isMobile ? (
            <div className="flex flex-wrap gap-3 mb-6 md:mb-0">
              {/* Add Service Button (Contractor) */}
              {isContractor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    onClick={handleOpenServiceModal}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-purple-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service
                  </button>
                </motion.div>
              )}
              
              {/* Add Service Type Button (Admin) */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    onClick={handleOpenServiceTypeModal}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-blue-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service Type
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="fixed bottom-[70px] left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col gap-3 shadow-lg md:hidden">
              {isContractor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <button
                    onClick={handleOpenServiceModal}
                    className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-purple-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service
                  </button>
                </motion.div>
              )}
              
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <button
                    onClick={handleOpenServiceTypeModal}
                    className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-md px-6 font-medium transition-all border-neutral-200 bg-blue-500 text-white [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Add New Service Type
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Modals */}
          {modalType === "mobile" && modalComponent === "Service" ? (
            <MobileModal
              onSubmit={handleServiceSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : modalType === "desktop" && modalComponent === "Service" ? (
            <DesktopModal
              onSubmit={handleServiceSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : modalType === "desktop" && modalComponent === "ServiceType" ? (
            <ServiceTypeModal
              onSubmit={handleServiceTypeSubmit}
              isOpen={isOpen}
              onClose={() => dispatch(closeModal())}
            />
          ) : null}

          {/* Service Listings */}
          <div className="mt-0 mb-10">
            {isMobile ? (
              <MobileListings 
                listings={listingsData} 
                fetchServices={fetchServices} 
                canEdit={canEdit}
                isLocked={user?.role === 0}
              />
            ) : (
              <WebListings 
                listings={listingsData} 
                fetchServices={fetchServices} 
                canEdit={canEdit}
                isLocked={user?.role === 0}
              />
            )}

          </div>
        </div>
      );
    }

    // For guest users (role == 0)
    // Show dialog or guest form
    return (
      <>
        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gray-500/20 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[100vh] overflow-y-auto modal-content"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="text-5xl text-blue-600 mb-2">
                    <span role="img" aria-label="Lock icon" aria-hidden="false">
                      🔒
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Restricted Access
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                      This content requires a registered account. Please complete your registration to access all portal features.
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <button
                      onClick={handleCloseDialog}
                      className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                    >
                      Complete Registration
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    
                    <p className="text-gray-600 font-medium">
                      Closing in: {countdown} seconds
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isDialogOpen && (
          <GuestForm
            isGuestFormOpen={isGuestFormOpen}
            isGuestFormClosed={() => {
              setIsInRegistration(false);
            }}
            isGuestFormBack={() => {
              setisDialogOpen(true);
              setIsInRegistration(false);
            }}
            onRegistrationStart={() => {
              setIsInRegistration(true);
              setIsGuestFormOpen(false); // Soft close GuestForm but keep registration flow
            }}
            onRegistrationComplete={() => {
              setIsInRegistration(false);
              setIsGuestFormOpen(false);
              setisDialogOpen(false);
            }}
            isLocked={user?.role === 0}
          />
        )}
      </>
    );
  }

  // Default return for non-logged in users
  return (
    <div>
      {/* ... services content ... */}
    </div>
  );
};

export default Services;