import React from "react";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Function to generate years dynamically (1900 to current year)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
};

// Validation Schema
const validationSchema = Yup.object().shape({
  propertyType: Yup.string().required("Property Type is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string()
    .matches(/^\d{5}$/, "Enter a valid 5-digit Zip Code")
    .required("Zip Code is required"),
  yearBuilt: Yup.string().required("Year Built is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  estSqFt: Yup.number()
    .typeError("Square Feet must be a number")
    .positive("Value must be positive")
    .required("Estimated Sq Ft is required"),
  beds: Yup.number()
    .typeError("Beds must be a number")
    .integer("Must be a whole number")
    .positive("Beds must be at least 1")
    .required("Number of Beds is required"),
  baths: Yup.number()
    .typeError("Baths must be a number")
    .positive("Must be at least 1")
    .required("Number of Baths is required"),
  estLotSize: Yup.number()
    .typeError("Lot Size must be a number")
    .positive("Lot Size must be positive")
    .required("Estimated Lot Size is required"),
  acreage: Yup.number()
    .typeError("Acreage must be a number")
    .positive("Acreage must be positive")
    .required("Acreage is required"),
  buyerAgentComp: Yup.string().required("Buyer's Agent Compensation is required"),
});

const DesktopModal = ({ onSubmit, isOpen, onClose }) => {
  const initialValues = {
    propertyType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    yearBuilt: "",
    price: "",
    estSqFt: "",
    beds: "",
    baths: "",
    estLotSize: "",
    acreage: "",
    amenities: [],
    buyerAgentComp: "",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        // Remove fixed positioning to avoid full screen and center using margin auto.
        className="mx-auto mt-20"
        style={{ maxWidth: "90%", outline: "none" }}
      >
        <Box
          className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-300"
          sx={{
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className="font-bold text-center" style={{ flex: 1 }}>
              Add New Listing
            </Typography>
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </Box>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              // Call the passed onSubmit prop with the form values
              onSubmit(values);
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form className="p-5">
                <Grid container spacing={2}>
                  {/* Property Type */}
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="standard">
                      <InputLabel required>Property Type</InputLabel>
                      <Field
                        as={Select}
                        name="propertyType"
                        value={values.propertyType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.propertyType && Boolean(errors.propertyType)}
                        displayEmpty
                      >
                        <MenuItem value="sale">For Sale</MenuItem>
                        <MenuItem value="rent">For Rent</MenuItem>
                        <MenuItem value="construction">New/Under Construction</MenuItem>
                        <MenuItem value="land">Land/Lot</MenuItem>
                      </Field>
                      <ErrorMessage
                        name="propertyType"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </FormControl>
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      label="Address"
                      fullWidth
                      name="address"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* City & State */}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="City"
                      fullWidth
                      name="city"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="State"
                      fullWidth
                      name="state"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* Zip Code & Year Built */}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Zip Code"
                      fullWidth
                      name="zipCode"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="zipCode"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" variant="standard">
                      <InputLabel required>Year Built</InputLabel>
                      <Field as={Select} name="yearBuilt">
                        {generateYears().map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                    <ErrorMessage
                      name="yearBuilt"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* Price & Estimated Sq Ft */}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Price"
                      fullWidth
                      name="price"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Est. Sq Ft"
                      fullWidth
                      name="estSqFt"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="estSqFt"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* Beds & Baths */}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Beds"
                      fullWidth
                      name="beds"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="beds"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Baths"
                      fullWidth
                      name="baths"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="baths"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* Lot Size & Acreage */}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Est. Lot Size"
                      fullWidth
                      name="estLotSize"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="estLotSize"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      required
                      label="Acreage"
                      fullWidth
                      name="acreage"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="acreage"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>

                  {/* Amenities */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="font-semibold">
                      Amenities
                    </Typography>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Pool", "55+", "Water View/Front", "HOA"].map(
                        (amenity) => (
                          <FormControlLabel
                            key={amenity}
                            control={
                              <Field
                                as={Checkbox}
                                name="amenities"
                                value={amenity}
                              />
                            }
                            label={amenity}
                          />
                        )
                      )}
                    </div>
                  </Grid>

                  {/* Buyer's Agent Compensation */}
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      label="Buyer's Agent Comp"
                      fullWidth
                      name="buyerAgentComp"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="buyerAgentComp"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <div className="mt-6 flex flex-col gap-4">
                  <button
                    type="submit"
                    className="group w-full relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-fuchsia-500 text-white px-6 font-medium transition-all [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
                  >
                    Submit Listing
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default DesktopModal;
