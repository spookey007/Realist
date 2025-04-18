import React, { useRef, useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth as useAppAuth } from "../context/AuthContext";
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { FilePond, registerPlugin } from 'react-filepond';
import { motion, AnimatePresence } from "framer-motion";
import 'filepond/dist/filepond.min.css';
import { stateCityData } from '../data/stateCityData';
import axios from 'axios';

// Plugins
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugins
registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const steps = ['License Validation', 'Basic Info', 'Company Info', 'Service Info', 'Final Submission'];

const stepFields = [
  ['licenseNumber'], // Step 0
  ['fullName', 'companyName'], // Step 1
  ['email', 'phone', 'website', 'address'], // Step 2
  ['city', 'state', 'zipCode', 'serviceCategory', 'yearsOfExperience', 'coverageArea', 'insurancePolicy', 'issuingAuthority', 'specialties', 'affiliations'], // Step 3
  ['captchaValue', 'agreement'], // Step 4
];

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  companyName: Yup.string().required('Company Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(
      /^$|^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      'Phone number must be in format (XXX) XXX-XXXX'
    ),
  website: Yup.string().url('Invalid URL'),
  address: Yup.string(),
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
  insurancePolicy: Yup.string().required('Insurance Policy is required'),
  captchaValue: Yup.string().required('Captcha is required'),
  agreement: Yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('You must agree to the terms'),
  affiliations: Yup.array()
    .min(1, 'Select at least one affiliation or certification')
    .required('Affiliations & Certifications are required'),
  specialties: Yup.array()
    .min(1, 'Select at least one specialty')
    .required('Specialties are required'),
  issuingAuthority: Yup.string().required('Issuing Authority is required'),
});

const RegisterModal = ({ isOpen, closeModal, onBack, existingUser }) => {

  const { login } = useAppAuth();
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const recaptchaRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const filePondRef = useRef();
  const navigate = useNavigate(); 
  const [licenseValidated, setLicenseValidated] = useState(false);
  const [licenseValidationError, setLicenseValidationError] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [zipCodeError, setZipCodeError] = useState('');
  const [isValidatingLicense, setIsValidatingLicense] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    fullName: '',
    companyName: '',
    email: existingUser?.email || '',
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
    issuingAuthority: '',
    specialties: [],
    affiliations: [],
    captchaValue: '',
    agreement: false,
  });
  const [coverageAreaInput, setCoverageAreaInput] = useState('');

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    closeModal?.();
  };
  


  const handleNext = async (validateForm, values, setTouched, setFieldValue) => {
    if (activeStep === 0) {
      // For license validation step
      if (!values.licenseNumber) {
        setLicenseValidationError('License number is required');
        return;
      }
      if (!/^\d+$/.test(values.licenseNumber)) {
        setLicenseValidationError('License number must contain only numbers');
        return;
      }
      
      const isValid = await validateLicenseNumber(values.licenseNumber, setFieldValue);
      if (!isValid) {
        return;
      }
    } else {
      // For other steps
      const errors = await validateForm();
      const currentStepFields = stepFields[activeStep];
      const stepErrors = Object.keys(errors).filter((key) => currentStepFields.includes(key));
      
      if (stepErrors.length > 0) {
        const touchedFields = {};
        currentStepFields.forEach((field) => (touchedFields[field] = true));
        setTouched(touchedFields);
        alertify.error('Please fill out all required fields in this step.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(existingUser)
      setSubmitting(true);
      const userId = existingUser?.id;
      const method = existingUser ? 'PUT' : 'POST';
      const url = existingUser
        ? `${import.meta.env.VITE_API_URL}/api/users/updateRea/${userId}`
        : `${import.meta.env.VITE_API_URL}/api/users/registerRea`;

      // Prepare JSON data
      const requestData = {
        fullName: values.fullName,
        companyName: values.companyName,
        email: values.email,
        phone: values.phone || '',
        website: values.website || '',
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        serviceCategory: values.serviceCategory,
        yearsOfExperience: values.yearsOfExperience,
        coverageArea: values.coverageArea || [],
        licenseNumber: values.licenseNumber,
        issuingAuthority: values.issuingAuthority,
        specialties: values.specialties || [],
        affiliations: values.affiliations || [],
        insurancePolicy: values.insurancePolicy,
        captchaValue: values.captchaValue,
        agreement: values.agreement,
        dateTime: selectedDateTime,
        latitude: location.latitude,
        longitude: location.longitude
      };

      // Debug logging
      console.log('Request Data:', requestData);

      // Make the API request
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        // Reset form and related UI states
        resetForm();
        setActiveStep(0);
        recaptchaRef.current?.reset();
        setSubmitting(false);

        // Update user state if the user exists
        if (existingUser) {
          // Ensure we have the complete user data with role
          const updatedUser = {
            ...existingUser,
            ...responseData.user,
            role: responseData.user.role || existingUser.role
          };
          console.log('Updated User:', updatedUser);
          login(updatedUser, responseData.token);
          handleSuccessAlert(updatedUser, navigate);
        } else {
          handleSuccessAlert(null, navigate);
        }
      } else {
        setSubmitting(false);
        console.error('API Error:', responseData);
        alertify.error(responseData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitting(false);
      alertify.error('Something went wrong. Please try again.');
    }
  };
  
  // Handle success message and navigation
  const handleSuccessAlert = (existingUser, navigate) => {
    const message = existingUser
      ? `<div class="space-y-3">
          <p class="text-lg font-semibold">Welcome to Realist! 🎉</p>
          <p>Your profile has been successfully updated. We're excited to have you continue your journey with us.</p>
          <p>You'll be redirected to your dashboard where you can access all your tools and features.</p>
        </div>`
      : `<div class="space-y-3">
          <p class="text-lg font-semibold">Welcome to Realist! 🎉</p>
          <p>Congratulations! Your registration is complete and your account is now active.</p>
          <p>You're now part of our professional real estate network. Get ready to:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Connect with other professionals</li>
            <li>Access exclusive tools and resources</li>
            <li>Grow your business with our platform</li>
          </ul>
          <p>Feel free to explore the platform and reach out if you have any questions.</p>
        </div>`;
  
    alertify.alert(
      existingUser ? "Profile Updated Successfully!" : "Welcome to Realist!",
      message,
      function () {
        alertify.message("OK");
        if (existingUser) {
          navigate("/dashboard");
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

  const handleStateChange = (e, setFieldValue) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setFieldValue('state', stateCode);
    setFieldValue('city', '');
    setFieldValue('zipCode', '');
    
    if (stateCode) {
      const stateCities = Object.keys(stateCityData[stateCode].cities);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e, setFieldValue) => {
    const city = e.target.value;
    setFieldValue('city', city);
    setFieldValue('zipCode', '');
  };

  const updateLocationData = (state, city, zipCode, setFieldValue) => {
    if (state) {
      setSelectedState(state);
      setFieldValue('state', state);
      const stateCities = Object.keys(stateCityData[state].cities);
      setCities(stateCities);
      
      if (city) {
        setFieldValue('city', city);
        if (zipCode) {
          setFieldValue('zipCode', zipCode);
        }
      }
    }
  };

  const validateLicenseNumber = async (licenseNumber, setFieldValue) => {
    try {
      setIsValidatingLicense(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/external/validate-license`, { licenseNumber });
      console.log('API Response:', response.data); // Debug log
      
      const { data, message } = response.data;
      console.log(data.isValid)
      if (data.isValid === true) {
        setLicenseValidated(true);
        setLicenseValidationError('');
        
        // Update form data with API response
        if (data) {
          const updatedData = { ...formData };
          
          // Update name if available
          if (data.name) {
            updatedData.fullName = data.name;
            setFieldValue('fullName', data.name);
          }
          
          // Update company name if available
          if (data.companyName) {
            updatedData.companyName = data.companyName;
            setFieldValue('companyName', data.companyName);
          }
          
          // Update address information if available
          if (data.address) {
            if (data.address.full) {
              updatedData.address = data.address.full;
              setFieldValue('address', data.address.full);
            }
            // if (data.address.city) {
            //   updatedData.city = data.address.city;
            //   setFieldValue('city', data.address.city);
            // }
            // if (data.address.state) {
            //   updatedData.state = data.address.state;
            //   setFieldValue('state', data.address.state);
            // }
            // if (data.address.zip) {
            //   updatedData.zipCode = data.address.zip;
            //   setFieldValue('zipCode', data.address.zip);
            // }
          }
          
          // Update the form data state
          setFormData(updatedData);
        }
        
        return true;
      } else {
        setLicenseValidated(false);
        setLicenseValidationError(message || 'Invalid license number');
        return false;
      }
    } catch (error) {
      console.error('Error validating license:', error);
      setLicenseValidated(false);
      setLicenseValidationError(
        error.response?.data?.message || 
        error.message || 
        'Error validating license number'
      );
      return false;
    } finally {
      setIsValidatingLicense(false);
    }
  };

  const validateZipCode = (zipCode, city, state) => {
    if (!zipCode || !city || !state) return true;
    
    const zip = parseInt(zipCode);
    const cityData = stateCityData[state]?.cities[city];
    
    if (!cityData) return true;
    
    const [minZip, maxZip] = cityData.zipRanges;
    return zip >= minZip && zip <= maxZip;
  };

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
          <h2 className="modal-title">Register</h2>
          <p className="text-center text-sm text-black-800 my-2 font-semibold">For Real Estate Agent</p>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              
            >
              {({ setFieldValue, validateForm, setTouched, values,isSubmitting  }) => (
              <Form>
                {activeStep === 0 && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mt-2">License Number</label>
                    <Field
                      name="licenseNumber"
                      placeholder="Enter your license number"
                      className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                      validate={(value) => {
                        if (!value) return 'License number is required';
                        if (!/^\d+$/.test(value)) return 'License number must contain only numbers';
                        return undefined;
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFieldValue('licenseNumber', value);
                        setLicenseValidationError('');
                      }}
                    />
                    <ErrorMessage name="licenseNumber" component="div" className="text-red-600" />
                    {licenseValidationError && (
                      <div className="text-red-600 mt-2">{licenseValidationError}</div>
                    )}
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Field name="fullName" placeholder="Full Name" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40" />
                    <ErrorMessage name="fullName" component="div" className="text-red-600" />
                    <Field name="companyName" placeholder="Company Name" className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2" />
                    <ErrorMessage name="companyName" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <Field
                      name="email"
                      placeholder="Email"
                      className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                      readOnly={!!existingUser?.email}
                      validate={(value) => {
                        if (!value) return 'Email is required';
                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                          return 'Invalid email address';
                        }
                        return undefined;
                      }}
                      value={existingUser?.email || values.email}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600" />
                    <Field 
                      name="phone" 
                      placeholder="Phone (XXX) XXX-XXXX (Optional)" 
                      className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                      validate={(value) => {
                        if (value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
                          return 'Phone number must be in format (XXX) XXX-XXXX';
                        }
                        return undefined;
                      }}
                      onChange={(e) => {
                        // Remove all non-digit characters
                        const value = e.target.value.replace(/\D/g, '');
                        
                        // Format the phone number
                        let formattedValue = '';
                        if (value.length > 0) {
                          formattedValue = '(' + value.substring(0, 3);
                          if (value.length > 3) {
                            formattedValue += ') ' + value.substring(3, 6);
                          }
                          if (value.length > 6) {
                            formattedValue += '-' + value.substring(6, 10);
                          }
                        }
                        
                        setFieldValue('phone', formattedValue);
                      }}
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-600" />
                    <Field 
                      name="website" 
                      placeholder="Website" 
                      className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                      validate={(value) => {
                        if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
                          return 'Invalid website URL';
                        }
                        return undefined;
                      }}
                    />
                    <ErrorMessage name="website" component="div" className="text-red-600" />
                    <Field 
                      name="address" 
                      placeholder="Address" 
                      className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                      validate={(value) => {
                        if (!value) return 'Address is required';
                        return undefined;
                      }}
                    />
                    <ErrorMessage name="address" component="div" className="text-red-600" />
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    {/* State - Select Field */}
                    <div>
                      <Field as="select" 
                        name="state" 
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        onChange={(e) => handleStateChange(e, setFieldValue)}
                      >
                        <option value="">Select State</option>
                        {Object.entries(stateCityData).map(([code, state]) => (
                          <option key={code} value={code}>{state.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="state" component="div" className="text-red-600" />
                    </div>

                    {/* City - Select Field */}
                    <div>
                      <Field as="select" 
                        name="city" 
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        onChange={(e) => handleCityChange(e, setFieldValue)}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="city" component="div" className="text-red-600" />
                    </div>

                    {/* Zip Code - Input Field */}
                    <div>
                      <Field 
                        name="zipCode" 
                        placeholder="Zip Code" 
                        className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        validate={(value) => {
                          if (!value) return 'Zip Code is required';
                          if (!/^\d{5}$/.test(value)) return 'Zip Code must be 5 digits';
                          if (!validateZipCode(value, values.city, values.state)) {
                            return 'Invalid Zip Code for selected city and state';
                          }
                          return undefined;
                        }}
                      />
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

                    {/* Coverage Area - Multi Select with Input */}
                    <div className="mb-6">
                      <label className="block text-base font-medium text-gray-700 mb-3">Coverage Area</label>
                      <div className="relative flex flex-wrap gap-3 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg min-h-[50px] focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-200">
                        {values.coverageArea?.map((area, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 bg-blue-100/80 text-blue-800 px-4 py-2 rounded-full shadow-sm hover:bg-blue-200/80 transition-colors duration-200"
                          >
                            <span className="text-base font-medium">{area}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newAreas = values.coverageArea.filter((_, i) => i !== index);
                                setFieldValue('coverageArea', newAreas);
                              }}
                              className="text-blue-600 hover:text-blue-800 ml-2 text-xl font-bold transition-colors duration-200"
                              aria-label="Remove area"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          value={coverageAreaInput}
                          onChange={(e) => setCoverageAreaInput(e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === 'Tab') && coverageAreaInput.trim()) {
                              e.preventDefault();
                              const newArea = coverageAreaInput.trim();
                              if (!values.coverageArea?.includes(newArea)) {
                                setFieldValue('coverageArea', [...(values.coverageArea || []), newArea]);
                              }
                              setCoverageAreaInput('');
                            }
                          }}
                          placeholder={values.coverageArea?.length ? "Type and press Enter/Tab to add more areas" : "Type and press Enter/Tab to add areas"}
                          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base min-w-[250px]"
                        />
                        {values.coverageArea?.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            {values.coverageArea.length} area{values.coverageArea.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Press Enter or Tab to add a new area. Click the × to remove an area.
                      </div>
                      <ErrorMessage name="coverageArea" component="div" className="text-red-600 mt-2" />
                    </div>
                    {/* License Number - Input Field */}
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
                  {activeStep === 4 && (
                    <>
                      {/* References section - commented out
                      <div className="mb-4">
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
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                        <Field
                          name="description"
                          placeholder="Description"
                          as="textarea"
                          className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        />
                        <ErrorMessage name="description" component="div" className="text-red-600" />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Upload Files (Optional - Max 5 files, total 20MB)
                        </label>
                        <FilePond
                          ref={filePondRef}
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
                      </div>
                      */}

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Captcha</label>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                          onChange={(value) => setFieldValue('captchaValue', value)}
                        />
                        <ErrorMessage name="captchaValue" component="div" className="text-red-600" />
                      </div>

                      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                        <div className="flex items-start">
                          <Field
                            type="checkbox"
                            name="agreement"
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            I confirm that all the information provided in this registration form is accurate and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or termination of my account. I agree to comply with all applicable laws and regulations governing real estate professionals in my jurisdiction.
                          </label>
                        </div>
                        <ErrorMessage name="agreement" component="div" className="text-red-600 mt-2" />
                      </div>
                    </>
                  )}

                <div className="flex justify-between mt-4">
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === 0) {
                        onBack?.();
                      } else {
                        setActiveStep((prev) => prev - 1);
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
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNext(validateForm, values, setTouched, setFieldValue)}
                      disabled={activeStep === 0 && isValidatingLicense}
                      className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                        ${
                          activeStep === 0 && isValidatingLicense
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
                        border-neutral-200
                        [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
                    >
                      {activeStep === 0 && isValidatingLicense ? "Validating..." : "Next"}
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

export default RegisterModal;
