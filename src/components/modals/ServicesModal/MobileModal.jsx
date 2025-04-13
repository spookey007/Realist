import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

// Validation Schema
const validationSchema = Yup.object().shape({
  service: Yup.string()
    .required("Service Name is required")
    .min(3, "Service Name must be at least 3 characters")
    .max(50, "Service Name must be at most 50 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
    
  service_type_id: Yup.string()
    .required("Service Type is required"),
});

const MobileModal = ({ onSubmit, isOpen, onClose }) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const initialValues = {
    service: "",
    description: "",
    service_type_id: "",
  };

  // Fetch service types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchServiceTypes();
    }
  }, [isOpen]);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service-types`
      );
      setServiceTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching service types:", error);
      alertify.error("Failed to fetch service types");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 bg-white flex flex-col h-full overflow-y-auto shadow-lg rounded-none"
      >
        {/* Sticky Header */}
        <div className="sticky border-t-2 border-b-2 border-gray-400 top-0 w-full bg-white shadow-md py-2 px-4 flex justify-between items-center z-50">
          <Typography
            variant="h7"
            className="font-bold text-lg"
            sx={{ textAlign: "center", display: "block" }}
          >
            Add New Service
          </Typography>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="p-5">
              <Grid container spacing={2}>
                {/* Service Type Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="service-type-label">Service Type</InputLabel>
                    <Field
                      as={Select}
                      labelId="service-type-label"
                      name="service_type_id"
                      value={values.service_type_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.service_type_id && Boolean(errors.service_type_id)}
                    >
                      <MenuItem value="">
                        <em>Select a service type</em>
                      </MenuItem>
                      {serviceTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.service_type_name}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="service_type_id"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </FormControl>
                </Grid>

                {/* Service Name */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    label="Service Name"
                    fullWidth
                    name="service"
                    variant="standard"
                  />
                  <ErrorMessage
                    name="service"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </Grid>
                
                {/* Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    label="Description"
                    fullWidth
                    name="description"
                    variant="standard"
                    multiline
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </Grid>
                
                <Grid item xs={12} className="mt-4">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="py-2"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Add Service"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </motion.div>
    </Modal>
  );
};

export default MobileModal;
