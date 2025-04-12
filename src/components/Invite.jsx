import React, { useRef, useState,useEffect } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth as useAppAuth } from "../context/AuthContext";
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
});

const Invite = ({ id: propId,existingUser, isOpen, closeModal, onBack }) => {
    const { login } = useAppAuth();
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const { id: urlId } = useParams(); // Invite ID from URL
    const id = propId || urlId; 
    const [inviteValid, setInviteValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inviteData, setInviteData] = useState(null); // to store invite if you want to prefill data later
    const [Error, setError] = useState(''); // ✅ Correct way to track error
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const recaptchaRef = useRef();
    const [activeStep, setActiveStep] = useState(0);
    const filePondRef = useRef();
    const navigate = useNavigate();

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

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    // Just call the parent's closeModal function
    setIsModalOpen(false);
    closeModal?.();
    // Reset form state if needed
    // setActiveStep(0);
    if (recaptchaRef.current) recaptchaRef.current.reset();
    if (filePondRef.current) filePondRef.current.removeFiles();
  };

  const handleSubmit = async (values, { resetForm }) => {
    const userId = existingUser?.id; // Get user ID if existing user
    const method = existingUser ? 'PUT' : 'POST'; // Use PUT if existing user, else POST
    const url = existingUser
      ? `${import.meta.env.VITE_API_URL}/api/users/updateContractor/${userId}` // Update URL
      : `${import.meta.env.VITE_API_URL}/api/users/registerContractor`; // Register URL
  
    try {
      // Make the API request
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dateTime: selectedDateTime,
          latitude: location.latitude,
          longitude: location.longitude,
          invite_id: id
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Reset form and related UI states
        resetForm();
        setActiveStep(0);
        recaptchaRef.current.reset();
        filePondRef.current.removeFiles();
  
        // Handle success for existing user
        if (existingUser) {
          login(responseData.user, responseData.tok); // Update user login
          handleSuccessAlert(existingUser, navigate); // Show success alert
        } else {
          handleSuccessAlert(existingUser, navigate); // New user, just call success alert
        }
      } else {
        alertify.error(responseData.message); // Display error if API response is not OK
      }
    } catch (error) {
      console.error(error);
      alertify.error('Something went wrong. Please try again.');
    }
  };
  
  // Handle success message and navigation for Invite
  const handleSuccessAlert = (existingUser, navigate) => {
    const message = existingUser
      ? `<p>Your contractor profile has been successfully updated!</p>`
      : `<p>We have received your contractor registration request on <strong>Realist</strong>. Our team is currently reviewing your application.</p>
         <p>You will receive a confirmation email once your account has been approved and activated.</p>`;
  
    alertify.alert(
      existingUser ? "Profile Updated!" : "Thank You for Registering!",
      `${message}<p>In the meantime, if you have any questions, feel free to reach out to us.</p>`,
      function () {
        alertify.message("OK");
        if (existingUser) {
          navigate("/dashboard"); // Redirect to dashboard for existing user
        }
      }
    );
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

//   useEffect(() => {
//     fetchLocation();
//   }, []);

useEffect(() => {
  const fetchOrSetInvite = async () => {
    setLoading(true);

    if (!existingUser) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invites/${id}`);
        const data = await response.json();

        if (response.ok) {
          setInviteValid(true);
          setInviteData(data.invite);
          setIsModalOpen(true);
        } else {
          setInviteValid(false);
          setIsModalOpen(false);
          setError(data.message);
          alertify.error(data.message || 'Invitation invalid or expired.');
        }
      } catch (error) {
        setError(error.message || 'Unknown error');
        setInviteValid(false);
        setIsModalOpen(false);
        alertify.error('Failed to validate invitation. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle local user as invite
      setInviteData(existingUser);
      setInviteValid(true);
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  fetchOrSetInvite();
}, [id, existingUser, isOpen, closeModal]);


  if (Error) {
    return <p className="text-center text-red-500 mt-8 font-bold">{Error}</p>; // ✅ Now will render if error exists
  }
  

return (
  <AnimatePresence>
    {isModalOpen && (
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

          <h2 className="modal-title">Registration Form </h2>
          <p className="text-center text-sm text-gray-500 my-2 font-semibold">For Contractor</p>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <Formik
              initialValues={{
                fullName: inviteData?.name || '',
                companyName: '',
                email: inviteData?.email || '',
                phone: '',
                website: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                serviceCategory: '',
                yearsOfExperience: '',
                coverageArea: [],
                licenseNumber: '',
                insurancePolicy: '',
                references: [{ name: '', phone: '' }],
                description: '',
                captchaValue: '',
                files: [],
              }}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              
            >
              {({ setFieldValue, validateForm, setTouched, values,isSubmitting  }) => (
              <Form>
                {activeStep === 0 && (
                  <>
                    <Field name="fullName" placeholder="Full Name" className="form-control" />
                    <ErrorMessage name="fullName" component="div" className="text-red-600" />
                    <Field name="companyName" placeholder="Company Name" className="form-control mt-2" />
                    <ErrorMessage name="companyName" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Field name="email" placeholder="Email" className="form-control" readOnly/>
                    <ErrorMessage name="email" component="div" className="text-red-600" />
                    <Field name="phone" placeholder="Phone" className="form-control mt-2" />
                    <ErrorMessage name="phone" component="div" className="text-red-600" />
                    <Field name="website" placeholder="Website" className="form-control mt-2" />
                    <ErrorMessage name="website" component="div" className="text-red-600" />
                    <Field name="address" placeholder="Address" className="form-control mt-2" />
                    <ErrorMessage name="address" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {/* City - Select Field */}
                    <div>
                      <Field as="select" name="city" className="form-control mt-2">
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
                      <Field as="select" name="state" className="form-control mt-2">
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
                      <Field name="zipCode" placeholder="Zip Code" className="form-control mt-2" />
                      <ErrorMessage name="zipCode" component="div" className="text-red-600" />
                    </div>

                    {/* Service Category - Select Field */}
                    <div>
                      <Field as="select" name="serviceCategory" className="form-control mt-2">
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
                        className="form-control mt-2"
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
                        className="form-control mt-2"
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
                      <Field name="licenseNumber" placeholder="License Number" className="form-control mt-2" />
                      <ErrorMessage name="licenseNumber" component="div" className="text-red-600" />
                    </div>

                    {/* Insurance Policy - Input Field */}
                    <div>
                      <Field name="insurancePolicy" placeholder="Insurance Policy" className="form-control mt-2" />
                      <ErrorMessage name="insurancePolicy" component="div" className="text-red-600" />
                    </div>
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
                                    className="form-control"
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
                                    className="form-control"
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
                              className="bg-blue-500 text-white px-2 py-1 rounded"
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
                        className="form-control mt-2"
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

                      <small className="text-gray-500">
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
                      type="button"
                      onClick={() => {
                        if (activeStep === 0) {
                          onBack?.(); // Handle custom back action for first step
                        } else {
                          setActiveStep((prev) => prev - 1); // Normal back navigation
                        }
                      }}
                      className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100 bg-white/30 text-black border-white/20 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                    >
                      Back
                    </button>

                    {/* Next/Submit Button */}
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
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNext(validateForm, values, setTouched)}
                        className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                      >
                        Next
                      </button>
                    )}
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

export default Invite;
