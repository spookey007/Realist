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

const MobileModal = ({ onSubmit, isOpen, onClose }) => {
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
            // Call the passed onSubmit prop with the form values
            onSubmit(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="p-5">
              <Grid container spacing={2}>
                

                {/* Service */}
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
      </motion.div>
    </Modal>
  );
};

export default MobileModal;
