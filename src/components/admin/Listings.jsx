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
import { StarIcon, HeartIcon, MapPinIcon, CurrencyDollarIcon, HomeIcon, BuildingOfficeIcon, BuildingStorefrontIcon, GlobeAltIcon, PlusIcon } from '@heroicons/react/24/outline';

// Helper function to generate random listing data with images
const generateRandomListing = () => {
  const propertyTypes = ['Residential', 'Commercial', 'Land', 'Industrial'];
  const randomPrice = `$${(Math.random() * 900000 + 100000).toFixed(0)}`;
  const randomBeds = Math.floor(Math.random() * 3) + 1;
  const randomBaths = `${(Math.random() * 4 + 1).toFixed(1)}`;
  const randomSqFt = `${Math.floor(Math.random() * 1000) + 1000}`;
  const randomAddress = `Random Address ${Math.floor(Math.random() * 1000)}`;
  const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const randomImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800'
  ];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    price: randomPrice,
    address: randomAddress,
    beds: randomBeds,
    baths: randomBaths,
    sqft: randomSqFt,
    type: randomType,
    status: Math.random() > 0.5 ? 'Active' : 'Pending',
    images: randomImages,
    features: ['Garage', 'Pool', 'Garden', 'Security System'].slice(0, Math.floor(Math.random() * 4) + 1),
    description: 'Beautiful property with modern amenities and great location. Perfect for families or investors.',
    agent: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john.smith@example.com'
    },
    lastUpdated: `${Math.floor(Math.random() * 30) + 1} days ago`,
    views: Math.floor(Math.random() * 1000),
    favorites: Math.floor(Math.random() * 100)
  };
};

const Listings = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const [listingsData, setListingsData] = useState(Array.from({ length: 8 }, generateRandomListing));
  const { isMobile, isTablet } = useDevice();
  const [selectedListing, setSelectedListing] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleOpenModal = () => {
    const deviceType = isMobile || isTablet ? "mobile" : "desktop";
    dispatch(openModal({ modalType: deviceType, modalComponent: "Listings" }));
  };

  const allowed_role = 2;

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
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("User is not logged in.");
        return;
      }
      const owner_id = user.id;

      const { address, propertyType, price, ...otherDetails } = values;
      const payload = {
        owner_id,
        address,
        property_type: propertyType,
        price,
        details: otherDetails,
      };

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
      dispatch(closeModal());
    } catch (error) {
      console.error("Error submitting property:", error);
      alertify.error("Error submitting property. Please try again later.");
    }
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'Residential':
        return <HomeIcon className="w-5 h-5" />;
      case 'Commercial':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'Industrial':
        return <BuildingStorefrontIcon className="w-5 h-5" />;
      default:
        return <GlobeAltIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="pt-5 flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
          <p className="text-gray-600">Manage and view your property listings</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          {!isMobile && (
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}

          {/* Add New Listing Button */}
          {user?.role === allowed_role && (
            <motion.button
              onClick={handleOpenModal}
              className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-blue-700 px-3 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              <span>Add New Listing</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Listings Grid/List */}
      {isMobile ? (
        <MobileListings listings={listingsData} />
      ) : (
        <WebListings listings={listingsData} viewMode={viewMode} />
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
    </div>
  );
};

export default Listings;
