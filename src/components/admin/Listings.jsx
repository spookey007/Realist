import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";

const generateRandomListing = () => {
  const randomPrice = `$${(Math.random() * 900000 + 100000).toFixed(0)}`;
  const randomBeds = Math.floor(Math.random() * 3) + 1;
  const randomBaths = `${(Math.random() * 4 + 1).toFixed(1)} ba`;
  const randomSqFt = `${Math.floor(Math.random() * 1000) + 1000} sqft`;
  const randomAddress = `Random Address ${Math.floor(Math.random() * 1000)}`;
  return {
    price: randomPrice,
    address: randomAddress,
    beds: randomBeds,
    baths: randomBaths,
    sqft: randomSqFt,
    liveIn: "Going Live In 31 DAYS",
  };
};

const listingsData = Array.from({ length: 5 }, generateRandomListing);

const Listings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    price: "",
    beds: "",
    baths: "",
  });

  return (
    <div className="p-8 flex flex-col gap-10">
      {/* Button to Open Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button
          onClick={() => setModalOpen(true)}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
        >
          Add New Listing
        </button>
      </motion.div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl p-8 max-w-3xl mx-auto mt-20 border border-gray-300">
            <Typography variant="h6" className="font-bold text-center">
              Add Listing
            </Typography>

            <FormControl fullWidth className="mt-4">
              <InputLabel>Property Type</InputLabel>
              <Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <MenuItem value="sale">For Sale</MenuItem>
                <MenuItem value="rent">For Rent</MenuItem>
                <MenuItem value="construction">New/Under Construction</MenuItem>
                <MenuItem value="land">Land/Lot</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2} className="mt-4">
              <Grid item xs={6}>
                <TextField label="City" fullWidth name="city" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="State" fullWidth name="state" onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </Grid>
            </Grid>

            <Grid container spacing={2} className="mt-4">
              <Grid item xs={6}>
                <TextField label="Price" fullWidth name="price" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Beds" fullWidth name="beds" onChange={(e) => setFormData({ ...formData, beds: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Baths" fullWidth name="baths" onChange={(e) => setFormData({ ...formData, baths: e.target.value })} />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" className="mt-4 font-semibold">
              Amenities
            </Typography>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["55+", "Investor Special", "Pool", "Waterfront", "HOA"].map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={<Checkbox value={amenity} onChange={(e) => setSelectedAmenities([...selectedAmenities, e.target.value])} />}
                  label={amenity}
                />
              ))}
            </div>

            <TextField label="Buyer's Agent Compensation" fullWidth className="mt-4" />

            <div className="flex justify-between mt-6">
            <button onClick={() => setModalOpen(false)} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
            Cancel
            </button>
            <button onClick={() => setModalOpen(false)} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
              Submit Listing
            </button>
            </div>
          </Box>
        </motion.div>
      </Modal>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listingsData.map((listing, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl shadow-lg bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Typography variant="h6" className="font-bold text-xl">
              {listing.price}
            </Typography>
            <Typography className="text-sm text-gray-500 mt-1">
              {listing.address}
            </Typography>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <span>{listing.beds} bd</span>
              <span className="mx-2">|</span>
              <span>{listing.baths}</span>
              <span className="mx-2">|</span>
              <span>{listing.sqft}</span>
            </div>
            <div className="mt-2 flex items-center text-blue-500 text-sm">
              <span className="mr-2">💡</span>
              <span>{listing.liveIn}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
