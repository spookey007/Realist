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


// Validation Schema
const validationSchema = Yup.object().shape({
  service: Yup.string()
  .required("Service Name is required")
  .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and numbers are allowed"),

  description: Yup.string()
    .required("Description is required")
    .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and numbers are allowed"),
});

const DesktopModal = ({ onSubmit, isOpen, onClose }) => {
  const initialValues = {
    service: "",
    description: "",
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
              Add New Service
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

                  {/* Address */}
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      label="Service"
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
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      label="Description"
                      fullWidth
                      name="description"
                      variant="standard"
                    />
                    <ErrorMessage
                      name="description"
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
                    Submit
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
