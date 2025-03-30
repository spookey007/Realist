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
            key={listing.service_id || listing.id}
            className="p-6 rounded-2xl shadow-lg bg-white cursor-pointer relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedListing(listing)}
          >
            <Typography variant="h6" className="font-bold text-xl">
              {listing.service_name}
            </Typography>
            <Typography className="text-sm text-gray-500 mt-1">
              Type: {listing.service_type_name}
            </Typography>
            <Typography className="text-sm text-gray-600 mt-2">
              {listing.description}
            </Typography>
            <Typography className="text-xs text-gray-400 mt-1">
              Created: {new Date(listing.created_at).toLocaleString()}
            </Typography>
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
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-2xl font-bold mb-4">
                {selectedListing.service_name}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                {/* Left: Service Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Service Details</h3>
                  <p><strong>Service ID:</strong> {selectedListing.service_id}</p>
                  <p><strong>Description:</strong> {selectedListing.description}</p>
                  <p><strong>Type:</strong> {selectedListing.service_type_name}</p>
                  <p><strong>Created at:</strong> {new Date(selectedListing.created_at).toLocaleString()}</p>
                </div>

                {/* Right: User Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Provider Info</h3>
                  <p><strong>Name:</strong> {selectedListing.name}</p>
                  <p><strong>Email:</strong> {selectedListing.email}</p>
                  <p><strong>Role:</strong> {selectedListing.role}</p>
                  <p><strong>Phone:</strong> {selectedListing.phone}</p>
                  {selectedListing.address?.trim() && (
                    <p><strong>Address:</strong> {selectedListing.address}</p>
                  )}
                  {selectedListing.city && <p><strong>City:</strong> {selectedListing.city}</p>}
                  {selectedListing.state && <p><strong>State:</strong> {selectedListing.state}</p>}
                  {selectedListing.country && <p><strong>Country:</strong> {selectedListing.country}</p>}
                  {selectedListing.postal_code && (
                    <p><strong>Postal Code:</strong> {selectedListing.postal_code}</p>
                  )}
                  {selectedListing.company_name && (
                    <p><strong>Company:</strong> {selectedListing.company_name}</p>
                  )}
                  {selectedListing.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={selectedListing.website}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedListing.website}
                      </a>
                    </p>
                  )}
                </div>

                {/* Full Width Section */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Professional Details</h3>
                    <p><strong>Service Category:</strong> {selectedListing.service_category}</p>
                    <p><strong>Years of Experience:</strong> {selectedListing.years_of_experience}</p>
                    <p><strong>Issuing Authority:</strong> {selectedListing.issuingAuthority}</p>
                  </div>
                  <div>
                    {Array.isArray(selectedListing.coverage_area) && (
                      <p>
                        <strong>Coverage Area:</strong>{" "}
                        {selectedListing.coverage_area.join(", ")}
                      </p>
                    )}
                    {Array.isArray(selectedListing.specialties) && (
                      <p>
                        <strong>Specialties:</strong>{" "}
                        {selectedListing.specialties.join(", ")}
                      </p>
                    )}
                    {Array.isArray(selectedListing.affiliations) && (
                      <p>
                        <strong>Affiliations:</strong>{" "}
                        {selectedListing.affiliations.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
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
