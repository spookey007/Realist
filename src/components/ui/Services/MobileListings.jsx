import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import orderBy from "lodash/orderBy";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const MobileListings = ({ listings, fetchServices, canEdit }) => {
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const sortListings = (listings, type) => {
    switch (type) {
      case "newest":
        return orderBy(listings, ["created_at"], ["desc"]);
      case "oldest":
        return orderBy(listings, ["created_at"], ["asc"]);
      case "nameAsc":
        return orderBy(listings, ["service_name"], ["asc"]);
      case "nameDesc":
        return orderBy(listings, ["service_name"], ["desc"]);
      default:
        return listings;
    }
  };

  const filterListings = (listings) => {
    return listings.filter((listing) =>
      [listing.service_name, listing.description, listing.service_type_name]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  const sortedFilteredListings = filterListings(sortListings(listings, sortType));

  return (
    <div className="px-4 py-2">
      {/* Filter Controls */}
      <div className="relative flex justify-end mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="bg-gray-200 p-2 rounded-full shadow-md text-gray-700 absolute right-0 top-0"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FaFilter size={18} className="text-gray-600" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 10, scale: 0.95 }}
          animate={
            isFilterOpen
              ? { opacity: 1, x: -10, scale: 1 }
              : { opacity: 0, x: 10, scale: 0.95 }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute top-0 right-9 bg-white shadow-md rounded-lg p-1 
            w-80 sm:w-64 md:w-72 lg:w-80 flex gap-2 items-center ${
              isFilterOpen ? "block" : "hidden"
            }`}
        >
          <div className="flex flex-col w-1/2">
            <label className="text-xs font-medium text-gray-600">Sort By</label>
            <select
              className="border px-2 py-1 rounded-md text-sm w-full"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="nameAsc">Name: A → Z</option>
              <option value="nameDesc">Name: Z → A</option>
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <label className="text-xs font-medium text-gray-600">Search</label>
            <input
              type="text"
              placeholder="Search services..."
              className="border rounded-md text-sm px-2 py-1 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* Listings */}
      <div className="mt-16">
        {sortedFilteredListings.map((listing, index) => (
          <div
            key={listing.id || index}
            onClick={() => {
              setSelectedListing(listing);
              setFormData({
                service_name: listing.service_name,
                description: listing.description,
                status: listing.status ?? 1,
              });
              setEditMode(false);
            }}
            className="border-b py-3 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">{listing.service_name}</div>
                <div className="text-gray-600 text-sm">{listing.service_type_name}</div>
                <div className="text-sm text-gray-500 mt-1">{listing.description}</div>
              </div>
              <div className="text-gray-400 text-xs text-right">
                {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xl font-bold mb-3">
                {editMode ? "Edit Service" : selectedListing.service_name}
              </div>

              {editMode ? (
                <div className="text-sm text-gray-700 space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Service Name</label>
                    <input
                      className="border w-full rounded-md p-2"
                      value={formData.service_name}
                      onChange={(e) =>
                        setFormData({ ...formData, service_name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                      className="border w-full rounded-md p-2"
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select
                      className="border w-full rounded-md p-2"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: parseInt(e.target.value) })
                      }
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-800 space-y-2">
                  <p><strong>Status:</strong> {selectedListing.status === 1 ? "Active" : "Inactive"}</p>
                  <p><strong>Type:</strong> {selectedListing.service_type_name}</p>
                  <p><strong>Created:</strong> {new Date(selectedListing.created_at).toLocaleString()}</p>
                  <p><strong>Description:</strong> {selectedListing.description}</p>
                  <hr className="my-3" />
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
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {selectedListing.website}
                      </a>
                    </p>
                  )}
                  <p><strong>Service Category:</strong> {selectedListing.service_category}</p>
                  <p><strong>Years of Experience:</strong> {selectedListing.years_of_experience}</p>
                  <p><strong>Issuing Authority:</strong> {selectedListing.issuingAuthority}</p>
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
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          setIsSaving(true);
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
                          setIsSaving(false);
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

export default MobileListings;
