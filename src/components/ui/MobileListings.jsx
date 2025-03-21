import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import orderBy from "lodash/orderBy";
import { motion } from "framer-motion";

const MobileListings = ({ listings }) => {
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const sortListings = (listings, type) => {
    switch (type) {
      case "newest":
        return orderBy(listings, ["created_at"], ["desc"]);
      case "oldest":
        return orderBy(listings, ["created_at"], ["asc"]);
      case "priceHigh":
        return orderBy(listings, ["price"], ["desc"]);
      case "priceLow":
        return orderBy(listings, ["price"], ["asc"]);
      default:
        return listings;
    }
  };

  const filterListings = (listings) => {
    return listings.filter((listing) =>
      Object.values({
        ...listing,
        ...listing.details,
      }).some((value) =>
        value
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleExpandToggle = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const sortedFilteredListings = filterListings(sortListings(listings, sortType));

  return (
    <div className="px-4 py-2">
      <div className="relative flex justify-end mb-4">
        {/* Filter Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="bg-gray-200 p-2 rounded-full shadow-md text-gray-700 absolute right-0 top-0"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FaFilter size={18} className="text-gray-600" />
        </motion.button>

        {/* Filter Widget */}
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
          {/* Sort By */}
          <div className="flex flex-col w-1/2">
            <label className="text-xs font-medium text-gray-600">Sort By</label>
            <select
              className="border px-2 py-1 rounded-md text-sm w-full"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="priceLow">Price: Low to High</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col w-1/2">
            <label className="text-xs font-medium text-gray-600">Search</label>
            <input
              type="text"
              placeholder="City, ZIP, etc..."
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
            onClick={() => handleExpandToggle(index)}
            className="border-b py-3 cursor-pointer"
          >
            {/* Basic Info */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">${listing.price}</div>
                <div className="text-gray-600">{listing.address}</div>
                <div className="text-sm text-gray-500">
                  {listing.details.beds} bd • {listing.details.baths} ba •{" "}
                  {listing.details.estSqFt || listing.details?.estSqFt} sqft
                </div>
              </div>
              <div className="text-blue-500 text-xs">
                {listing.liveIn || ""}
              </div>
            </div>
            {/* Expandable Details */}
            {expandedIndex === index && (
              <div className="mt-2 text-sm text-gray-700">
                {listing.details && (
                  <div>
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
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileListings;
