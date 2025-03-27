import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import MobileModal from "../modals/ServicesModal/MobileModal";
import DesktopModal from "../modals/ServicesModal/DesktopModal";
import WebListings from "../ui/Listings/WebListings";
import MobileListings from "../ui/Listings/MobileListings";
import { motion } from "framer-motion";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";


const Services = () => {
  const dispatch = useDispatch();
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const [listingsData, setListingsData] = useState([]);
  const { isMobile,isTablet } = useDevice();
  const handleOpenModal = () => {
    const deviceType = isMobile || isTablet ? "mobile" : "desktop";
    dispatch(openModal({ modalType: deviceType, modalComponent: "Listings" }));
  };

   // Fetch properties from API
   const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services/`
      );
      console.log("Fetched services:", response.data);
      setListingsData(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("Form Data:", values);

      // Retrieve the logged-in user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("User is not logged in.");
        return;
      }
      const owner_id = user.id;

      // Extract required fields from form values
      const { address, propertyType, price, ...otherDetails } = values;

      // Prepare the payload with required fields and extra details stored in the JSON 'details' column
      const payload = {
        owner_id,
        address,
        property_type: propertyType,
        price,
        details: otherDetails, // All additional fields go into details
      };

      // Send a POST request to create a new services
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/services/`,
        payload
      );

      if (response.data && response.data.message) {
        alertify.success(response.data.message);
      } else {
        alertify.success("Service created successfully!");
      }
      
      fetchProperties();
      // Close the modal after successful submission
      dispatch(closeModal());
    } catch (error) {
      console.error("Error submitting service:", error);
      alertify.error("Error submitting service. Please try again later.");
    }
  };

  return (
    <div className="pt-5 flex flex-col gap-5">
      {/* Button for Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={handleOpenModal}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
            Add New Service
          </button>
        </motion.div>
      )}

      {/* Full-Width Sticky Button for Mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-0 mt-5 px-2 mb-10 top-12 w-full z-50"
        >
          <button
            onClick={handleOpenModal}
            className="group w-full relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-purple-500 text-white px-6 font-medium transition-all [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
          >
            Add New Listing
          </button>
        </motion.div>
      )}

      {/* Render Modal Based on Device Type */}
      {modalType === "mobile" ? (
        <MobileModal
          onSubmit={handleSubmit}
          isOpen={isOpen}
          onClose={() => dispatch(closeModal())}
        />
      ) : (
        <DesktopModal
          onSubmit={handleSubmit}
          isOpen={isOpen}
          onClose={() => dispatch(closeModal())}
        />
      )}

      {/* Listings Grid */}
      {isMobile ? (
        <MobileListings listings={listingsData} />
      ) : (
        <WebListings listings={listingsData} />
      )}
    </div>
  );
};

export default Services;
