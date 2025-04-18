import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, HeartIcon, MapPinIcon, CurrencyDollarIcon, HomeIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const MobileListings = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Static images for different property types
  const propertyImages = {
    'Single Family Home': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'Apartment': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'Condo': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'Townhouse': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'Land': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
  };

  const getPropertyImage = (listing) => {
    return propertyImages[listing.property_type] || propertyImages.default;
  };

  // Get unique property types from the listings
  const propertyTypes = [...new Set(listings.map(listing => listing.property_type))];

  // Calculate min and max price from listings
  const prices = listings.map(listing => parseFloat(listing.price)).filter(price => !isNaN(price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;
  
  // Initialize price range to show all data initially
  const [priceRange, setPriceRange] = useState({ 
    min: 0, 
    max: 1000000 
  });

  // Separate state for input values
  const [inputValues, setInputValues] = useState({
    min: '0',
    max: '1000000'
  });

  const sortListings = (listings, type) => {
    switch (type) {
      case "newest":
        return [...listings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "oldest":
        return [...listings].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "priceHigh":
        return [...listings].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "priceLow":
        return [...listings].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      default:
        return listings;
    }
  };

  const filterListings = (listings) => {
    return listings.filter((listing) => {
      // Search filter
      const searchMatch = searchQuery === "" || 
        listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.property_type.toLowerCase().includes(searchQuery.toLowerCase());

      // Property type filter
      const typeMatch = selectedTypes.length === 0 || 
        selectedTypes.includes(listing.property_type);

      // Price range filter - only apply if user has interacted with the filter
      const price = parseFloat(listing.price);
      const priceMatch = priceRange.min === 0 && priceRange.max === 1000000 ? true : 
        !isNaN(price) && price >= priceRange.min && price <= priceRange.max;

      return searchMatch && typeMatch && priceMatch;
    });
  };

  const sortedFilteredListings = filterListings(sortListings(listings, sortType));

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle price range changes
  const handleMinPriceChange = (value) => {
    // Update input value
    setInputValues(prev => ({ ...prev, min: value }));
    
    // Only update filter if value is valid
    if (value !== '') {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setPriceRange(prev => ({
          ...prev,
          min: Math.min(Math.max(numValue, minPrice), prev.max)
        }));
      }
    }
  };

  const handleMaxPriceChange = (value) => {
    // Update input value
    setInputValues(prev => ({ ...prev, max: value }));
    
    // Only update filter if value is valid
    if (value !== '') {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setPriceRange(prev => ({
          ...prev,
          max: Math.max(Math.min(numValue, maxPrice), prev.min)
        }));
      }
    }
  };

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="px-4 py-2">
      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by address or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative flex-1">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FunnelIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Property Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Property Type</h3>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={inputValues.min}
                        min={minPrice}
                        max={priceRange.max}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={inputValues.max}
                        min={priceRange.min}
                        max={maxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-6">
        {sortedFilteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Property Image */}
            <div className="relative h-48">
              <img
                src={getPropertyImage(listing)}
                alt={listing.address}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                {listing.status || 'Available'}
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                <StarIcon className="w-3 h-3 text-yellow-500" />
                <span>{listing.favorites || 0}</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {listing.address}
                  </h3>
                  <p className="text-sm text-gray-500">{listing.property_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">${parseFloat(listing.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{new Date(listing.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <HomeIcon className="w-4 h-4" />
                  <span>{listing.details?.bedrooms || 0} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{listing.details?.bathrooms || 0} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span>{listing.details?.square_footage?.toLocaleString() || 0} sqft</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {listing.details?.features?.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600"
                  >
                    {feature}
                  </span>
                ))}
                {listing.details?.features?.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                    +{listing.details.features.length - 3} more
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${listing.agent?.name || 'Agent'}&background=0D8ABC&color=fff`}
                      alt="Agent"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{listing.agent?.name || 'Agent'}</p>
                      <p className="text-xs text-gray-500">{listing.agent?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    onClick={() => setSelectedListing(listing)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Modal for Selected Listing */}
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={getPropertyImage(selectedListing)}
                    alt={selectedListing.address}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Details */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedListing.address}</h2>
                  <p className="text-lg text-blue-600 font-semibold">${parseFloat(selectedListing.price).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium">{selectedListing.property_type}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-medium">{selectedListing.details?.year_built}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Square Footage</p>
                    <p className="font-medium">{selectedListing.details?.square_footage?.toLocaleString()} sqft</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-medium">{selectedListing.details?.bedrooms}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium">{selectedListing.details?.bathrooms}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Listed On</p>
                    <p className="font-medium">{new Date(selectedListing.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.details?.features?.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{selectedListing.details?.description}</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Contact Agent
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileListings;
