import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import WebListings from "../ui/Services/WebListings";
import MobileListings from "../ui/Services/MobileListings";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";

const Services = () => {
  const [listingsData, setListingsData] = useState([]);
  const { isMobile,isTablet } = useDevice();

   // Fetch properties from API
   const fetchServices = async () => {
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
    fetchServices();
  }, []);

  return (
    <div className=" flex flex-col gap-5">

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
