import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  service_type_name: Yup.string()
    .required("Service Type Name is required")
    .min(3, "Service Type Name must be at least 3 characters")
    .max(50, "Service Type Name must be at most 50 characters"),
});

const ServiceTypeModal = ({ onSubmit, isOpen, onClose }) => {
  const initialValues = {
    service_type_name: "",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto mt-20"
        style={{ maxWidth: "90%", outline: "none" }}
      >
        <Box
          className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-300"
          sx={{
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className="font-bold text-center" style={{ flex: 1 }}>
              Add New Service Type
            </Typography>
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </Box>
          
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
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      label="Service Type Name"
                      fullWidth
                      name="service_type_name"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="service_type_name"
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
                    >
                      Add Service Type
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default ServiceTypeModal; 