import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@mui/material";

const WebListings = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <motion.div
            key={listing.id}
            className="p-6 rounded-2xl shadow-lg bg-white cursor-pointer relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedListing(listing)}
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
                {listing.sqft || listing.details?.estSqFt} sqft
              </span>
            </div>
            <div className="mt-2 flex items-center text-blue-500 text-sm">
              <span className="mr-2">💡</span>
              <span>{listing.liveIn}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Selected Listing */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6"
              onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
            >
              <div className="text-lg font-bold mb-2">
                ${selectedListing.price}
              </div>
              <div className="text-gray-600 mb-2">{selectedListing.address}</div>

              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>City:</strong> {selectedListing.details.city}</div>
                <div><strong>State:</strong> {selectedListing.details.state}</div>
                <div><strong>Zip Code:</strong> {selectedListing.details.zipCode}</div>
                <div><strong>Year Built:</strong> {selectedListing.details.yearBuilt}</div>
                <div><strong>Est. Sq Ft:</strong> {selectedListing.details.estSqFt}</div>
                <div><strong>Lot Size:</strong> {selectedListing.details.estLotSize}</div>
                <div><strong>Acreage:</strong> {selectedListing.details.acreage}</div>
                <div><strong>Amenities:</strong> {
                  Array.isArray(selectedListing.details.amenities)
                    ? selectedListing.details.amenities.join(", ")
                    : selectedListing.details.amenities
                }</div>
                <div><strong>Buyer Agent Comp:</strong> {selectedListing.details.buyerAgentComp}</div>
              </div>

              <button
                onClick={() => setSelectedListing(null)}
                className="mt-6 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebListings;
