import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import orderBy from "lodash/orderBy";
import { motion, AnimatePresence } from "framer-motion";

const MobileListings = ({ listings }) => {
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

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
              <option value="priceHigh">Price: High to Low</option>
              <option value="priceLow">Price: Low to High</option>
            </select>
          </div>

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
            onClick={() => setSelectedListing(listing)}
            className="border-b py-3 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">${listing.price}</div>
                <div className="text-gray-600">{listing.address}</div>
                <div className="text-sm text-gray-500">
                  {listing.details.beds} bd • {listing.details.baths} ba •{" "}
                  {listing.details.estSqFt} sqft
                </div>
              </div>
              <div className="text-blue-500 text-xs">
                {listing.liveIn || ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Details Modal */}
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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()} // Prevent outside click from closing
            >
              <div className="text-lg font-bold mb-2">${selectedListing.price}</div>
              <div className="text-gray-600 mb-2">{selectedListing.address}</div>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>City:</strong> {selectedListing.details.city}</div>
                <div><strong>State:</strong> {selectedListing.details.state}</div>
                <div><strong>Zip Code:</strong> {selectedListing.details.zipCode}</div>
                <div><strong>Year Built:</strong> {selectedListing.details.yearBuilt}</div>
                <div><strong>Est. Sq Ft:</strong> {selectedListing.details.estSqFt}</div>
                <div><strong>Lot Size:</strong> {selectedListing.details.estLotSize}</div>
                <div><strong>Acreage:</strong> {selectedListing.details.acreage}</div>
                <div><strong>Amenities:</strong>{" "}
                  {Array.isArray(selectedListing.details.amenities)
                    ? selectedListing.details.amenities.join(", ")
                    : selectedListing.details.amenities}
                </div>
                <div><strong>Buyer Agent Comp:</strong> {selectedListing.details.buyerAgentComp}</div>
              </div>

              <button
                onClick={() => setSelectedListing(null)}
                className="mt-4 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition"
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

export default MobileListings;
