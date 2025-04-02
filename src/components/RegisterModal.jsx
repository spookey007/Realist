import React, { useRef, useState,useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { FilePond, registerPlugin } from 'react-filepond';
import { motion, AnimatePresence } from "framer-motion";
import 'filepond/dist/filepond.min.css';

// Plugins
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugins
registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const steps = ['Basic Info', 'Company Info', 'Service Info', 'Documents & Captcha'];

const stepFields = [
  ['fullName', 'companyName'], // Step 0
  ['email', 'phone', 'website', 'address'], // Step 1
  ['city', 'state', 'zipCode', 'serviceCategory', 'yearsOfExperience', 'coverageArea', 'licenseNumber', 'insurancePolicy'], // Step 2
  ['references', 'description', 'files', 'captchaValue'], // Step 3
];

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  companyName: Yup.string().required('Company Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  website: Yup.string().url('Invalid URL').required('Website is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip Code is required'),
  serviceCategory: Yup.string().required('Service Category is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .required('Years of Experience is required'),
  coverageArea: Yup.array()
  .min(1, 'Select at least one coverage area')
  .required('Coverage Area is required'),
  licenseNumber: Yup.string().required('License Number is required'),
  insurancePolicy: Yup.string().required('Insurance Policy is required'),
  references: Yup.array()
  .min(1, 'At least one reference is required')
  .of(
    Yup.object().shape({
      name: Yup.string()
        .matches(/^[a-zA-Z ]+$/, 'Name must contain only letters')
        .required('Reference name is required'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone must contain only numbers')
        .required('Reference phone is required'),
    })
  ),
  files: Yup.array()
  .min(1, 'At least one file is required')
  .max(5, 'You can upload a maximum of 5 files'),

  description: Yup.string().required('Description is required'),
  captchaValue: Yup.string().required('Captcha is required'),
  affiliations: Yup.array()
  .min(1, 'Select at least one affiliation or certification')
  .required('Affiliations & Certifications are required'),
  specialties: Yup.array()
    .min(1, 'Select at least one specialty')
    .required('Specialties are required'),
  issuingAuthority: Yup.string().required('Issuing Authority is required'),
});

const RegisterModal = ({ isOpen, closeModal }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const recaptchaRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const filePondRef = useRef();
  const handleNext = async (validateForm, values, setTouched) => {
    const errors = await validateForm();
    const currentStepFields = stepFields[activeStep];
    const stepErrors = Object.keys(errors).filter((key) => currentStepFields.includes(key));
    if (stepErrors.length > 0) {
      // Mark fields as touched to show errors
      const touchedFields = {};
      currentStepFields.forEach((field) => (touchedFields[field] = true));
      setTouched(touchedFields);
      alertify.error('Please fill out all required fields in this step.');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log("submission received:", values);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/registerRea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          dateTime: selectedDateTime,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      const responseData = await response.json();
      // console.log(responseData)
      if (response.ok) {
        // alertify.success('User created successfully!');
        resetForm(); // reset Formik
        setActiveStep(0); // reset stepper
        recaptchaRef.current.reset(); // reset captcha
        filePondRef.current.removeFiles(); // ✅ reset FilePond files
        closeModal(); // optional: close modal
        alertify.alert(
          "Thank You for Registering!",
          `
          <p>We have received your registration request on <strong>Realist</strong>. Our team is currently reviewing your application to ensure everything is in order.</p>
          <p>You will receive a confirmation email once your account has been approved and activated.</p>
          <p>In the meantime, if you have any questions, feel free to reach out to us.</p>
          `, function () {
          alertify.message("OK");
          // navigate("/"); // Navigate to the home page after clicking OK
        });
      } else {
        alertify.error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Something went wrong. Please try again.');
    }
  };
  

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // alertify.error('Unable to access your location. Falling back to IP-based location.');
          // fetchIPBasedLocation();
        }
      );
    } else {
      fetchIPBasedLocation();
    }
  };

  const fetchIPBasedLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error) {
      // alertify.error('Unable to fetch location based on IP address.');
    }
  };

  // useEffect(() => {
  //   fetchLocation();
  // }, []);

  return (
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smoother easeOutExpo
      className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50" // darker backdrop
    >
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gray-500/20  rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[100vh] overflow-y-auto modal-content"
    >
          <button className="close-modal" onClick={closeModal}>&times;</button>
          <h2 className="modal-title">Register</h2>
          <p className="text-center text-sm text-black-800 my-2 font-semibold">For Real Estate Agent</p>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <Formik
              initialValues={{
                fullName: '',
                companyName: '',
                email: '',
                phone: '',
                website: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                serviceCategory: '',
                yearsOfExperience: '',
                coverageArea: [],
                insurancePolicy: '',
                licenseNumber: '',
                issuingAuthority: '',
                specialties: [],
                affiliations: [],
                references: [{ name: '', phone: '' }],
                description: '',
                captchaValue: '',
                files: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              
            >
              {({ setFieldValue, validateForm, setTouched, values,isSubmitting  }) => (
              <Form>
                {activeStep === 0 && (
                  <>
                    <Field name="fullName" placeholder="Full Name" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    <ErrorMessage name="fullName" component="div" className="text-red-600" />
                    <Field name="companyName" placeholder="Company Name" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                    <ErrorMessage name="companyName" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Field name="email" placeholder="Email" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    <ErrorMessage name="email" component="div" className="text-red-600" />
                    <Field name="phone" placeholder="Phone" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                    <ErrorMessage name="phone" component="div" className="text-red-600" />
                    <Field name="website" placeholder="Website" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                    <ErrorMessage name="website" component="div" className="text-red-600" />
                    <Field name="address" placeholder="Address" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                    <ErrorMessage name="address" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {/* City - Select Field */}
                    <div>
                      <Field as="select" name="city" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2">
                        <option value="">Select City</option>
                        <option value="Springfield">Springfield</option>
                        <option value="Jacksonville">Jacksonville</option>
                        <option value="Decatur">Decatur</option>
                        <option value="Madison">Madison</option>
                        <option value="Franklin">Franklin</option>
                        <option value="Clinton">Clinton</option>
                      </Field>
                      <ErrorMessage name="city" component="div" className="text-red-600" />
                    </div>

                    {/* State - Select Field */}
                    <div>
                      <Field as="select" name="state" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2">
                        <option value="">Select State</option>
                        <option value="California">California</option>
                        <option value="Texas">Texas</option>
                        <option value="Florida">Florida</option>
                        <option value="New York">New York</option>
                        <option value="Illinois">Illinois</option>
                        <option value="Ohio">Ohio</option>
                        <option value="Georgia">Georgia</option>
                      </Field>
                      <ErrorMessage name="state" component="div" className="text-red-600" />
                    </div>

                    {/* Zip Code - Input Field */}
                    <div>
                      <Field name="zipCode" placeholder="Zip Code" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                      <ErrorMessage name="zipCode" component="div" className="text-red-600" />
                    </div>

                    {/* Service Category - Select Field */}
                    <div>
                      <Field as="select" name="serviceCategory" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2">
                        <option value="">Select Service Category</option>
                        <option value="General Contractor">General Contractor</option>
                        <option value="Electrical Contractor">Electrical Contractor</option>
                        <option value="Plumbing Contractor">Plumbing Contractor</option>
                        <option value="HVAC Contractor">HVAC Contractor</option>
                        <option value="Roofing Contractor">Roofing Contractor</option>
                        <option value="XYZ Contractor">XYZ Contractor</option>
                      </Field>
                      <ErrorMessage name="serviceCategory" component="div" className="text-red-600" />
                    </div>

                    {/* Years of Experience - Number Field with Min Validation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mt-2">Years of Experience</label>
                      <Field
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        placeholder="Years of Experience"
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                      />
                      <ErrorMessage name="yearsOfExperience" component="div" className="text-red-600" />
                    </div>

                    {/* Coverage Area - Multi Select Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mt-2">Coverage Area</label>
                      <Field
                        as="select"
                        name="coverageArea"
                        multiple
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        onChange={(event) => {
                          const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
                          setFieldValue('coverageArea', selectedOptions);
                        }}
                      >
                        <option value="Springfield">Springfield</option>
                        <option value="Jacksonville">Jacksonville</option>
                        <option value="Decatur">Decatur</option>
                        <option value="Franklin">Franklin</option>
                        <option value="Madison">Madison</option>
                        <option value="Lincoln">Lincoln</option>
                      </Field>
                      <ErrorMessage name="coverageArea" component="div" className="text-red-600" />
                    </div>
                    {/* License Number - Input Field */}
                    <div>
                      <Field name="licenseNumber" placeholder="License Number" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                      <ErrorMessage name="licenseNumber" component="div" className="text-red-600" />
                    </div>

                    {/* Insurance Policy - Input Field */}
                    <div>
                      <Field name="insurancePolicy" placeholder="Insurance Policy" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                      <ErrorMessage name="insurancePolicy" component="div" className="text-red-600" />
                    </div>
                    {/* License Issuing Authority */}
                  <label className="block text-sm font-medium text-gray-700 mt-4">Issuing Authority</label>
                  <Field
                    name="issuingAuthority"
                    placeholder="Issuing Authority"
                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                  />
                  <ErrorMessage name="issuingAuthority" component="div" className="text-red-600" />

                  {/* Specialties - Multi Select */}
                  <label className="block text-sm font-medium text-gray-700 mt-4">Specialties</label>
                  <Field
                    as="select"
                    name="specialties"
                    multiple
                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                    onChange={(event) => {
                      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
                      setFieldValue('specialties', selectedOptions);
                    }}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Land">Land</option>
                    <option value="Luxury">Luxury</option>
                  </Field>
                  <ErrorMessage name="specialties" component="div" className="text-red-600" />

                  {/* Affiliations - Multi Select */}
                  <label className="block text-sm font-medium text-gray-700 mt-4">Affiliations & Certifications</label>
                  <Field
                    as="select"
                    name="affiliations"
                    multiple
                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                    onChange={(event) => {
                      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
                      setFieldValue('affiliations', selectedOptions);
                    }}
                  >
                    <option value="NAR">National Association of Realtors (NAR)</option>
                    <option value="CREA">Canadian Real Estate Association (CREA)</option>
                    <option value="LEED">LEED Certification</option>
                    <option value="Luxury Certified">Luxury Certified</option>
                  </Field>
                  </>
                )}
                  {activeStep === 3 && (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mt-2">References (Name & Phone)</label>
                      <FieldArray name="references">
                        {({ push, remove, form }) => (
                          <div>
                            {form.values.references.map((reference, index) => (
                              <div key={index} className="flex space-x-2 items-center mb-2">
                                <div className="flex-1">
                                  <Field
                                    name={`references[${index}].name`}
                                    placeholder="Name"
                                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                                  />
                                  <ErrorMessage
                                    name={`references[${index}].name`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Field
                                    name={`references[${index}].phone`}
                                    placeholder="Phone"
                                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                                  />
                                  <ErrorMessage
                                    name={`references[${index}].phone`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => remove(index)}
                                  >
                                    -
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="bg-cyan-800 text-white px-2 py-1 rounded"
                              onClick={() => push({ name: '', phone: '' })}
                            >
                              + Add Reference
                            </button>
                            {/* Whole array error (if empty array or other schema level error) */}
                            {typeof form.errors.references === 'string' && (
                              <div className="text-red-600 mt-1">{form.errors.references}</div>
                            )}
                          </div>
                        )}
                      </FieldArray>
                        
                      <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
                      <Field
                        name="description"
                        placeholder="Description"
                        as="textarea"
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                      />
                      <ErrorMessage name="description" component="div" className="text-red-600" />

                      <label className="block text-sm font-medium text-gray-700 mt-4">
                        Upload Files (Max 5 files, total 20MB)
                      </label>
                      <FilePond
                        ref={filePondRef} // ✅ Attach ref
                        files={values.files}
                        allowMultiple={true}
                        maxFiles={5}
                        maxTotalFileSize="20MB"
                        acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        onupdatefiles={(fileItems) => {
                          setFieldValue('files', fileItems.map(fileItem => fileItem.file));
                        }}
                        className="mt-2"
                      />

                      <small className="text-black-800">
                        You can upload up to 5 files. The total combined size should not exceed 20MB. Accepted formats: JPG, JPEG, PNG, PDF.
                      </small>
                      <ErrorMessage name="files" component="div" className="text-red-600" />
                      <label className="block text-sm font-medium text-gray-700 mt-4">Captcha</label>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(value) => setFieldValue('captchaValue', value)}
                      />
                      <ErrorMessage name="captchaValue" component="div" className="text-red-600" />

                    </>
                  )}

                <div className="flex justify-between mt-4">
                {/* Back Button */}
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                    ${
                      activeStep === 0
                        ? "bg-white/30 text-black cursor-not-allowed border-white/20"
                        : "bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                    }
                    [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
                >
                  Back
                </button>

                {/* Conditional Submit Button (Final Step) */}
                {activeStep === steps.length - 1 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                      ${
                        isSubmitting
                          ? "bg-cyan-600/60 text-white cursor-not-allowed"
                          : "bg-cyan-600 text-white hover:bg-cyan-700"
                      }
                      border-neutral-200
                      [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
                  >
<<<<<<< HEAD
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={() => handleNext(validateForm, values, setTouched)}
                    className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                  >
                    Next
                  </button>
                )}
=======
                    Back
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>Submit</Button>
                  ) : (
                   
                   
                    <Button
                      onClick={() => handleNext(validateForm, values, setTouched)}
                      variant="contained"
                      color="primary">
                      Next
                    </Button>

                    
                  )}
>>>>>>> e29f9c684aa4acaa35ae797f63ad6f1503dc64fe
                </div>
              </Form>
            )}
          </Formik>
          </motion.div>
      </motion.div>
        )}
</AnimatePresence>
  );
};

export default RegisterModal;
