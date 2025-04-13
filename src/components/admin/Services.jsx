import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import MobileModal from "../modals/ServicesModal/MobileModal";
import DesktopModal from "../modals/ServicesModal/DesktopModal";
import ServiceTypeModal from "../modals/ServicesModal/ServiceTypeModal";
import WebListings from "../ui/Services/WebListings";
import MobileListings from "../ui/Services/MobileListings";
import { motion } from "framer-motion";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";
import { useAuth } from '../../context/AuthContext';
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const Services = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isOpen, modalType, modalComponent } = useSelector((state) => state.modal);
  const [listingsData, setListingsData] = useState([]);
  const { isMobile, isTablet } = useDevice();
  
  // Role constants
  const ADMIN_ROLE = 1;
  const CONTRACTOR_ROLE = 3;
  const isAdmin = user?.role === ADMIN_ROLE;
  const isContractor = user?.role === CONTRACTOR_ROLE;
  const canEdit = [ADMIN_ROLE, CONTRACTOR_ROLE].includes(user?.role);

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
        
        {/* Add Service Type Button (Admin) */}
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
          />
        ) : (
          <WebListings 
            listings={listingsData} 
            fetchServices={fetchServices} 
            canEdit={canEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Services;