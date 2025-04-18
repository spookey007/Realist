import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown, FaChevronUp, FaEdit, FaEye, FaSpinner, FaPlus, FaTimes } from "react-icons/fa";
import orderBy from "lodash/orderBy";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MobileListings = ({ listings, fetchServices, canEdit, isAdmin, isLocked }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categoryServices, setCategoryServices] = useState({});
  const [loadingCategories, setLoadingCategories] = useState({});
  const [categoryPages, setCategoryPages] = useState({});
  const [hasMoreByCategory, setHasMoreByCategory] = useState({});
  const pageSize = 10;
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showNewServiceTypeModal, setShowNewServiceTypeModal] = useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToElement = (elementId, offset = 60) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

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

  const loadServicesForCategory = async (categoryId, isLoadMore = false) => {
    if (loadingCategories[categoryId]) return;

    try {
      setLoadingCategories(prev => ({ ...prev, [categoryId]: true }));
      
      const currentPage = categoryPages[categoryId] || 1;
      const page = isLoadMore ? currentPage + 1 : 1;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services/by-category/${categoryId}`,
        {
          params: {
            page,
            limit: pageSize
          }
        }
      );

      const newServices = response.data.services || [];
      const totalCount = response.data.pagination?.total || 0;

      setCategoryServices(prev => ({
        ...prev,
        [categoryId]: isLoadMore 
          ? [...(prev[categoryId] || []), ...newServices]
          : newServices
      }));

      setCategoryPages(prev => ({
        ...prev,
        [categoryId]: page
      }));

      setHasMoreByCategory(prev => ({
        ...prev,
        [categoryId]: newServices.length === pageSize && (page * pageSize) < totalCount
      }));

    } catch (error) {
      console.error("Error loading services:", error);
      alertify.error("Failed to load services");
    } finally {
      setLoadingCategories(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  const toggleCategory = async (categoryId) => {
    const isExpanding = !expandedCategories[categoryId];
    setExpandedCategories(prev => ({ ...prev, [categoryId]: isExpanding }));

    if (isExpanding) {
      if (!categoryServices[categoryId]) {
        await loadServicesForCategory(categoryId);
      }
      setTimeout(() => {
        const element = document.getElementById(`category-mobile-${categoryId}`);
        if (element) {
          const headerOffset = 60;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  };

  const loadMoreForCategory = async (categoryId) => {
    await loadServicesForCategory(categoryId, true);
    setTimeout(() => {
      const services = categoryServices[categoryId] || [];
      if (services.length > 0) {
        const lastServiceId = services[services.length - 1].id;
        const element = document.getElementById(`service-mobile-${lastServiceId}`);
        if (element) {
          const headerOffset = 60;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 300);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/services/${selectedListing.id}`,
        {
          service_name: formData.service_name,
          description: formData.description,
          status: formData.status,
        }
      );

      if (response.status === 200) {
        // Update the categoryServices state
        setCategoryServices(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(categoryId => {
            updated[categoryId] = updated[categoryId].map(service => 
              service.id === response.data.id ? response.data : service
            );
          });
          return updated;
        });

        // Update the selectedListing with the new data
        setSelectedListing(response.data);

        alertify.success("Service updated successfully");
        setEditMode(false);
      } else {
        alertify.error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alertify.error("Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

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

      {/* Categories and Services */}
      {isInitialLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="mt-8 space-y-6 pb-24">
          {listings.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  toggleCategory(category.id);
                  scrollToElement(`category-mobile-${category.id}`);
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.service_type_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.total_count} services available
                  </p>
                </div>
                <div className="text-gray-400">
                  {expandedCategories[category.id] ? (
                    <FaChevronUp size={18} />
                  ) : (
                    <FaChevronDown size={18} />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expandedCategories[category.id] && (
                  <motion.div
                    id={`category-mobile-${category.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-y-auto border-t border-gray-200"
                    style={{ maxHeight: '400px' }}
                  >
                    <div className="divide-y divide-gray-200">
                      {loadingCategories[category.id] && !categoryServices[category.id] ? (
                        <div className="flex justify-center py-6">
                          <FaSpinner className="w-5 h-5 text-blue-600 animate-spin" />
                        </div>
                      ) : (
                        <>
                          {isLocked ? (
                            <div className="space-y-4 py-4">
                              {[...Array(5)].map((_, index) => {
                                // First 2 cards: actual service data
                                if (index < 2 && categoryServices[category.id]?.length > 0) {
                                  const service = categoryServices[category.id][index];
                                  return (
                                    <div key={index} className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                      <div className="p-4">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <h4 className="text-base font-medium text-gray-900">
                                              {service.service_name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2">
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                service.status === 1 
                                                  ? 'bg-green-100 text-green-600' 
                                                  : 'bg-red-100 text-red-600'
                                              }`}>
                                                {service.status === 1 ? 'Active' : 'Inactive'}
                                              </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                              {service.description}
                                            </p>
                                          </div>
                                        </div>
                                        {service.created_by && (
                                          <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">Service Provider:</span>
                                              <span>{service.created_by.name}</span>
                                            </div>
                                            {service.created_by.company_name && (
                                              <div className="flex items-center gap-2">
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600">{service.created_by.company_name}</span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                                // Next 3 cards: visible with lock overlay
                                if (index >= 2 && index < 5) {
                                  return (
                                    <div key={index} className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                        <div className="text-center">
                                          <div className="text-4xl mb-2">🔒</div>
                                          <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                                          <p className="text-sm text-gray-600 mt-1">
                                            To access all services, Complete your{' '}
                                            <button 
                                              onClick={() => navigate('/dashboard')}
                                              className="font-bold text-blue-600 hover:text-blue-700 underline"
                                            >
                                              profile
                                            </button>
                                          </p>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <h4 className="text-base font-medium text-gray-900">
                                              Premium Service {index + 1}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2">
                                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Active
                                              </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                              This is a premium service that requires registration to access.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          ) : categoryServices[category.id]?.length > 0 ? (
                            <div className="space-y-6 py-4">
                              {filterListings(sortListings(categoryServices[category.id], sortType)).map((service) => (
                                <motion.div
                                  key={service.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="p-4 hover:bg-gray-50 transition-colors mx-3 my-3 rounded-lg border border-gray-200 shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedListing(service);
                                    setFormData({
                                      service_name: service.service_name,
                                      description: service.description,
                                      status: service.status ?? 1,
                                    });
                                    setEditMode(false);
                                    scrollToElement(`service-mobile-${service.id}`);
                                  }}
                                  id={`service-mobile-${service.id}`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h4 className="text-base font-medium text-gray-900">
                                        {service.service_name}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          service.status === 1 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-red-100 text-red-600'
                                        }`}>
                                          {service.status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                        {service.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-3">
                                      {canEdit && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedListing(service);
                                            setFormData({
                                              service_name: service.service_name,
                                              description: service.description,
                                              status: service.status ?? 1,
                                            });
                                            setEditMode(true);
                                          }}
                                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                          title="Edit Service"
                                        >
                                          <FaEdit size={16} />
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedListing(service);
                                          setEditMode(false);
                                        }}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                        title="View Details"
                                      >
                                        <FaEye size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {service.created_by && (
                                    <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Service Provider:</span>
                                        <span>{service.created_by.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {service.created_by.company_name && (
                                          <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{service.created_by.company_name}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                              {hasMoreByCategory[category.id] && (
                                <div className="p-4 flex justify-center border-t border-gray-200 bg-white">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      loadMoreForCategory(category.id);
                                    }}
                                    disabled={loadingCategories[category.id]}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                                  >
                                    {loadingCategories[category.id] ? (
                                      <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Loading more services...</span>
                                      </>
                                    ) : (
                                      'Load more'
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-6">
                              No services available in this category
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

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
              <div className="flex justify-between items-center mb-3">
                <div className="text-xl font-bold">
                  {editMode ? "Edit Service" : selectedListing.service_name}
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
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
                  <p><strong>Type:</strong> {selectedListing.service_type_name}</p>
                  <p><strong>Description:</strong> {selectedListing.description}</p>
                  <hr className="my-3" />
                  {selectedListing.created_by && (
                    <>
                      <p><strong>Service Provider:</strong> {selectedListing.created_by.name}</p>
                      <p><strong>Email:</strong> {selectedListing.created_by.email}</p>
                      <p><strong>Phone:</strong> {selectedListing.created_by.phone}</p>
                      {selectedListing.created_by.address?.trim() && (
                        <p><strong>Address:</strong> {selectedListing.created_by.address}</p>
                      )}
                      {selectedListing.created_by.city && (
                        <p><strong>City:</strong> {selectedListing.created_by.city}</p>
                      )}
                      {selectedListing.created_by.state && (
                        <p><strong>State:</strong> {selectedListing.created_by.state}</p>
                      )}
                      {selectedListing.created_by.country && (
                        <p><strong>Country:</strong> {selectedListing.created_by.country}</p>
                      )}
                      {selectedListing.created_by.postal_code && (
                        <p><strong>Postal Code:</strong> {selectedListing.created_by.postal_code}</p>
                      )}
                      {selectedListing.created_by.company_name && (
                        <p><strong>Company:</strong> {selectedListing.created_by.company_name}</p>
                      )}
                      {selectedListing.created_by.website && (
                        <p>
                          <strong>Website:</strong>{" "}
                          <a
                            href={selectedListing.created_by.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {selectedListing.created_by.website}
                          </a>
                        </p>
                      )}
                      {selectedListing.created_by.service_category && (
                        <p><strong>Service Category:</strong> {selectedListing.created_by.service_category}</p>
                      )}
                      {selectedListing.created_by.years_of_experience && (
                        <p><strong>Years of Experience:</strong> {selectedListing.created_by.years_of_experience}</p>
                      )}
                      {selectedListing.created_by.issuingAuthority && (
                        <p><strong>Issuing Authority:</strong> {selectedListing.created_by.issuingAuthority}</p>
                      )}
                      {Array.isArray(selectedListing.created_by.coverage_area) && (
                        <p><strong>Coverage Area:</strong> {selectedListing.created_by.coverage_area.join(", ")}</p>
                      )}
                      {Array.isArray(selectedListing.created_by.specialties) && (
                        <p><strong>Specialties:</strong> {selectedListing.created_by.specialties.join(", ")}</p>
                      )}
                      {Array.isArray(selectedListing.created_by.affiliations) && (
                        <p><strong>Affiliations:</strong> {selectedListing.created_by.affiliations.join(", ")}</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
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
