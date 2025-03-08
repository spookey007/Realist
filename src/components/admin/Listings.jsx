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

const Listings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleSelectChange = (event) => {
    setPropertyType(event.target.value);
  };

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    setSelectedAmenities((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  return (
    <div className="p-6">
      {/* Button to Open Modal */}
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Listing
      </Button>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-16">
          <Typography variant="h6" className="font-bold">
            Add Listing
          </Typography>

          {/* Property Type Selection */}
          <FormControl fullWidth className="mt-4">
            <InputLabel>Property Type</InputLabel>
            <Select value={propertyType} onChange={handleSelectChange}>
              <MenuItem value="sale">For Sale</MenuItem>
              <MenuItem value="rent">For Rent</MenuItem>
              <MenuItem value="construction">New/Under Construction</MenuItem>
              <MenuItem value="land">Land/Lot</MenuItem>
            </Select>
          </FormControl>

          {/* Address Fields */}
          <Grid container spacing={2} className="mt-4">
            <Grid item xs={6}>
              <TextField label="City" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="State" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Zip Code" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Year Built" fullWidth required />
            </Grid>
          </Grid>

          {/* Pricing & Size */}
          <Grid container spacing={2} className="mt-4">
            <Grid item xs={6}>
              <TextField label="Price" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Estimated Square Ft" fullWidth required />
            </Grid>
          </Grid>

          {/* Bed/Bath Selection */}
          <Grid container spacing={2} className="mt-4">
            <Grid item xs={6}>
              <TextField label="Beds" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Baths" fullWidth required />
            </Grid>
          </Grid>

          {/* Lot Size & Acreage */}
          <Grid container spacing={2} className="mt-4">
            <Grid item xs={6}>
              <TextField label="Est. Lot Size" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Checkbox />} label="Acreage" />
            </Grid>
          </Grid>

          {/* Amenities */}
          <Typography variant="subtitle1" className="mt-4 font-semibold">
            Amenities
          </Typography>
          <div className="flex gap-4 mt-2">
            <FormControlLabel
              control={<Checkbox value="55+" onChange={handleAmenityChange} />}
              label="55+"
            />
            <FormControlLabel
              control={
                <Checkbox value="investor" onChange={handleAmenityChange} />
              }
              label="Investor Special/Tenant Occupied"
            />
            <FormControlLabel
              control={<Checkbox value="pool" onChange={handleAmenityChange} />}
              label="Pool"
            />
            <FormControlLabel
              control={
                <Checkbox value="waterfront" onChange={handleAmenityChange} />
              }
              label="Water View/Front"
            />
            <FormControlLabel
              control={<Checkbox value="hoa" onChange={handleAmenityChange} />}
              label="HOA"
            />
          </div>

          {/* Buyer's Agent Compensation */}
          <TextField
            label="Enter Buyer's Agent Compensation"
            fullWidth
            className="mt-4"
          />

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Submit Listing
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Listings;
