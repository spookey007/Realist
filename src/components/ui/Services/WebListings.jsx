import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@mui/material";
import axios from 'axios';

const WebListings = ({ listings,fetchServices,canEdit }) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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
            onClick={() => {
              setSelectedListing(listing);
              setFormData({
                service_name: listing.service_name,
                description: listing.description,
                status: listing.status || 1,
              });
              setEditMode(false);
            }}
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
            <Typography className="text-xs text-gray-400 mt-1">
              Created By: {listing.name}
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
                {editMode ? "Edit Service" : selectedListing.service_name}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                {/* Left: Service Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Service Details</h3>

                  {editMode ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                      <input
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                        value={formData.service_name}
                        onChange={(e) =>
                          setFormData({ ...formData, service_name: e.target.value })
                        }
                      />

                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />

                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: parseInt(e.target.value) })
                        }
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <p><strong>Service ID:</strong> {selectedListing.service_id}</p>
                      <p><strong>Description:</strong> {selectedListing.description}</p>
                      <p><strong>Type:</strong> {selectedListing.service_type_name}</p>
                      <p><strong>Created at:</strong> {new Date(selectedListing.created_at).toLocaleString()}</p>
                      <p><strong>Status:</strong> {selectedListing.status === 1 ? "Active" : "Inactive"}</p>
                    </>
                  )}
                </div>

                {/* Right: User Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Provider Info</h3>
                  <p><strong>Name:</strong> {selectedListing.name}</p>
                  <p><strong>Email:</strong> {selectedListing.email}</p>
                  <p><strong>Role:</strong> {selectedListing.role}</p>
                  <p><strong>Phone:</strong> {selectedListing.phone}</p>
                  {selectedListing.address?.trim() && <p><strong>Address:</strong> {selectedListing.address}</p>}
                  {selectedListing.city && <p><strong>City:</strong> {selectedListing.city}</p>}
                  {selectedListing.state && <p><strong>State:</strong> {selectedListing.state}</p>}
                  {selectedListing.country && <p><strong>Country:</strong> {selectedListing.country}</p>}
                  {selectedListing.postal_code && <p><strong>Postal Code:</strong> {selectedListing.postal_code}</p>}
                  {selectedListing.company_name && <p><strong>Company:</strong> {selectedListing.company_name}</p>}
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
                      <p><strong>Coverage Area:</strong> {selectedListing.coverage_area.join(", ")}</p>
                    )}
                    {Array.isArray(selectedListing.specialties) && (
                      <p><strong>Specialties:</strong> {selectedListing.specialties.join(", ")}</p>
                    )}
                    {Array.isArray(selectedListing.affiliations) && (
                      <p><strong>Affiliations:</strong> {selectedListing.affiliations.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col md:flex-row gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          setIsSaving(true); // ✅ Disable button
                          const response = await axios.put(
                            `${import.meta.env.VITE_API_URL}/api/services/${selectedListing.service_id}`,
                            formData
                          );

                          if (response.status === 200) {
                            setSelectedListing((prev) => ({
                              ...prev,
                              ...response.data,
                            }));
                            await fetchServices();
                            setEditMode(false);
                            alertify.success("Service updated successfully");
                          } else {
                            alertify.error("Something went wrong");
                          }
                        } catch (error) {
                          console.error("Failed to update service:", error);
                          alertify.error("Something went wrong");
                        } finally {
                          setIsSaving(false); // ✅ Re-enable button
                        }
                      }}
                      disabled={isSaving}
                      className={`w-full py-2 px-4 rounded-md transition ${
                        isSaving
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {canEdit && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebListings;
