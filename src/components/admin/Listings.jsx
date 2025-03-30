import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import MobileModal from "../modals/ListingsModal/MobileModal";
import DesktopModal from "../modals/ListingsModal/DesktopModal";
import WebListings from "../ui/Listings/WebListings";
import MobileListings from "../ui/Listings/MobileListings";
import { motion } from "framer-motion";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";
import { useAuth } from '../../context/AuthContext';
// Helper function to generate random listing data
const generateRandomListing = () => {
  const randomPrice = `$${(Math.random() * 900000 + 100000).toFixed(0)}`;
  const randomBeds = Math.floor(Math.random() * 3) + 1;
  const randomBaths = `${(Math.random() * 4 + 1).toFixed(1)} ba`;
  const randomSqFt = `${Math.floor(Math.random() * 1000) + 1000} sqft`;
  const randomAddress = `Random Address ${Math.floor(Math.random() * 1000)}`;
  return {
    price: randomPrice,
    address: randomAddress,
    beds: randomBeds,
    baths: randomBaths,
    sqft: randomSqFt,
    liveIn: "Going Live In 31 DAYS",
  };
};

// const listingsData = Array.from({ length: 5 }, generateRandomListing);

const Listings = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const [listingsData, setListingsData] = useState([]);
  const { isMobile,isTablet } = useDevice();
  const handleOpenModal = () => {
    const deviceType = isMobile || isTablet ? "mobile" : "desktop";
    dispatch(openModal({ modalType: deviceType, modalComponent: "Listings" }));
  };

  const allowed_role = 2;
   // Fetch properties from API
   const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/properties/`
      );
      console.log("Fetched Properties:", response.data);
      setListingsData(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
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

      // Send a POST request to create a new property
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/properties/`,
        payload
      );

      if (response.data && response.data.message) {
        alertify.success(response.data.message);
      } else {
        alertify.success("Property created successfully!");
      }
      
      fetchProperties();
      // Close the modal after successful submission
      dispatch(closeModal());
    } catch (error) {
      console.error("Error submitting property:", error);
      alertify.error("Error submitting property. Please try again later.");
    }
  };

  return (
    <div className="pt-5 flex flex-col gap-5">
      {/* Button for Desktop */}
      {!isMobile && user?.role === allowed_role && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={handleOpenModal}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
            Add New Listing
          </button>
        </motion.div>
      )}

      {/* Full-Width Sticky Button for Mobile */}
      {isMobile && user?.role === allowed_role && (
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

export default Listings;
