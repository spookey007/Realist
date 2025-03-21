import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const WebListings = ({ listings }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpandToggle = (id, e) => {
    e.stopPropagation(); // Prevent the card's onClick (if any) from triggering
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          className="p-6 rounded-2xl shadow-lg bg-white cursor-pointer relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" className="font-bold text-xl">
            ${listing.price}
          </Typography>
          <Typography className="text-sm text-gray-500 mt-1">
            {listing.address}
          </Typography>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>{listing.details.beds} bd</span>
            <span className="mx-2">|</span>
            <span>{listing.details.baths} ba</span>
            <span className="mx-2">|</span>
            <span>
              {listing.sqft || (listing.details && listing.details.estSqFt)}{" "}
              sqft
            </span>
          </div>
          <div className="mt-2 flex items-center text-blue-500 text-sm">
            <span className="mr-2">💡</span>
            <span>{listing.liveIn}</span>
          </div>

          {/* Dedicated Expand Button */}
          <IconButton
            onClick={(e) => handleExpandToggle(listing.id, e)}
            className="absolute top-2 right-2 w-full"
            size="small"
          >
            <ExpandMoreIcon
              style={{
                transform:
                  expandedId === listing.id ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>

          {expandedId === listing.id && listing.details && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-sm text-gray-700 overflow-hidden"
            >
              <div>
                <strong>City:</strong> {listing.details.city}
              </div>
              <div>
                <strong>State:</strong> {listing.details.state}
              </div>
              <div>
                <strong>Zip Code:</strong> {listing.details.zipCode}
              </div>
              <div>
                <strong>Year Built:</strong> {listing.details.yearBuilt}
              </div>
              <div>
                <strong>Est. Sq Ft:</strong> {listing.details.estSqFt}
              </div>
              <div>
                <strong>Lot Size:</strong> {listing.details.estLotSize}
              </div>
              <div>
                <strong>Acreage:</strong> {listing.details.acreage}
              </div>
              <div>
                <strong>Amenities:</strong>{" "}
                {Array.isArray(listing.details.amenities)
                  ? listing.details.amenities.join(", ")
                  : listing.details.amenities}
              </div>
              <div>
                <strong>Buyer Agent Comp:</strong>{" "}
                {listing.details.buyerAgentComp}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default WebListings;
