import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth as useAppAuth } from "../context/AuthContext";
import { Stepper, Step, StepLabel } from '@mui/material';
import { FilePond, registerPlugin } from 'react-filepond';
import { motion, AnimatePresence } from "framer-motion";
import 'filepond/dist/filepond.min.css';
import { stateCityData } from '../data/stateCityData';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// Plugins
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugins
registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const steps = ['Basic Info', 'Company Info', 'Service Info', 'Final Submission'];

const stepFields = [
  ['fullName', 'companyName'], // Step 0
  ['email', 'phone', 'website', 'address'], // Step 1
  ['city', 'state', 'zipCode', 'serviceCategory', 'yearsOfExperience', 'coverageArea', 'licenseNumber', 'insurancePolicy'], // Step 2
  ['agreement', 'captchaValue'], // Step 3
];

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  companyName: Yup.string()
    .required('Company Name is required')
    .min(2, 'Company name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(
      /^$|^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      'Phone number must be in format (XXX) XXX-XXXX'
    ),
  website: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .url('Invalid website URL'),
  address: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .min(5, 'Address must be at least 5 characters'),
  city: Yup.string()
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  zipCode: Yup.string()
    .required('Zip Code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  serviceCategory: Yup.string()
    .required('Service Category is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .required('Years of Experience is required'),
  coverageArea: Yup.array()
    .min(1, 'Select at least one coverage area')
    .required('Coverage Area is required'),
  licenseNumber: Yup.string()
    .required('License Number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Invalid license number format'),
  insurancePolicy: Yup.string()
    .required('Insurance Policy is required'),
  agreement: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
  captchaValue: Yup.string()
    .required('Captcha verification is required'),
});

const Invite = ({ id: propId, existingUser, isOpen, closeModal, onBack }) => {
  const { login } = useAppAuth();
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const { id: urlId } = useParams();
  const id = propId || urlId;
  const [inviteValid, setInviteValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const recaptchaRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const filePondRef = useRef();
  const navigate = useNavigate();
  const [stateQuery, setStateQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [zipCodeError, setZipCodeError] = useState('');
  const [coverageAreaInput, setCoverageAreaInput] = useState('');

  const handleNext = async (validateForm, values, setTouched) => {
    const errors = await validateForm();
    const currentStepFields = stepFields[activeStep];
    const stepErrors = Object.keys(errors).filter((key) => currentStepFields.includes(key));
    
    if (stepErrors.length > 0) {
      const touchedFields = {};
      currentStepFields.forEach((field) => (touchedFields[field] = true));
      setTouched(touchedFields);
      alertify.error('Please fill out all required fields in this step.');
      return false;
    }
    setActiveStep((prev) => prev + 1);
    return true;
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    closeModal?.();
    if (recaptchaRef.current) recaptchaRef.current.reset();
    if (filePondRef.current) filePondRef.current.removeFiles();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const userId = existingUser?.id;
      const method = existingUser ? 'PUT' : 'POST';
      const url = existingUser
        ? `${import.meta.env.VITE_API_URL}/api/users/updateContractor/${userId}`
        : `${import.meta.env.VITE_API_URL}/api/users/registerContractor`;

      // Prepare the data object
      const data = {
        fullName: values.fullName,
        companyName: values.companyName,
        email: values.email,
        phone: values.phone || null,
        website: values.website || null,
        address: values.address || null,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        serviceCategory: values.serviceCategory,
        yearsOfExperience: values.yearsOfExperience,
        coverageArea: values.coverageArea,
        licenseNumber: values.licenseNumber,
        insurancePolicy: values.insurancePolicy,
        agreement: values.agreement,
        captchaValue: values.captchaValue,
        dateTime: selectedDateTime.toISOString(),
        latitude: location.latitude,
        longitude: location.longitude,
        invite_id: id
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        resetForm();
        setActiveStep(0);
        recaptchaRef.current?.reset();

        if (existingUser) {
          const updatedUser = {
            ...existingUser,
            ...responseData.user,
            role: responseData.user.role || existingUser.role
          };
          login(updatedUser, responseData.token);
          handleSuccessAlert(updatedUser, navigate);
        } else {
          handleSuccessAlert(null, navigate);
        }
      } else {
        alertify.error(responseData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alertify.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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

  const handleSuccessAlert = (existingUser, navigate) => {
    const message = existingUser
      ? `<div class="space-y-3">
          <p class="text-lg font-semibold">Welcome to Realist! 🎉</p>
          <p>Your contractor profile has been successfully updated. We're excited to have you continue your journey with us.</p>
          <p>You'll be redirected to your dashboard where you can access all your tools and features.</p>
        </div>`
      : `<div class="space-y-3">
          <p class="text-lg font-semibold">Welcome to Realist! 🎉</p>
          <p>Congratulations! Your registration is complete and your account is now active.</p>
          <p>You're now part of our professional contractor network. Get ready to:</p>
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

  const filteredStates = Object.entries(stateCityData)
    .filter(([code, state]) => 
      state.name.toLowerCase().includes(stateQuery.toLowerCase())
    )
    .map(([code, state]) => ({ code, name: state.name }));

  const filteredCities = cities
    .filter(city => 
      city.toLowerCase().includes(cityQuery.toLowerCase())
    );

  if (error) {
    return <p className="text-center text-red-500 mt-8 font-bold">{error}</p>;
  }
  
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-500/20 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[100vh] overflow-y-auto modal-content"
          >
            <h2 className="modal-title">Registration Form</h2>
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
                agreement: false,
                captchaValue: '',
              }}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, validateForm, setTouched, values, isSubmitting }) => (
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
                      <Field 
                        name="email" 
                        placeholder="Email" 
                        className="form-control" 
                        readOnly={!!inviteData?.email}
                      />
                      <ErrorMessage name="email" component="div" className="text-red-600" />
                      
                      <Field 
                        name="phone" 
                        placeholder="Phone (XXX) XXX-XXXX (Optional)" 
                        className="form-control mt-2"
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
                        placeholder="Website (Optional)" 
                        className="form-control mt-2"
                      />
                      <ErrorMessage name="website" component="div" className="text-red-600" />
                      
                      <Field 
                        name="address" 
                        placeholder="Address (Optional)" 
                        className="form-control mt-2"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-600" />
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <div className="relative">
                        <Combobox value={selectedState} onChange={(value) => {
                          setSelectedState(value);
                          setFieldValue('state', value);
                          setFieldValue('city', '');
                          setFieldValue('zipCode', '');
                          if (value) {
                            const stateCities = Object.keys(stateCityData[value].cities);
                            setCities(stateCities);
                          } else {
                            setCities([]);
                          }
                        }}>
                          <div className="relative">
                            <Combobox.Input
                              className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                              placeholder="Search state..."
                              onChange={(event) => setStateQuery(event.target.value)}
                              displayValue={(state) => state ? stateCityData[state].name : ''}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                          </div>
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredStates.map((state) => (
                              <Combobox.Option
                                key={state.code}
                                value={state.code}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-cyan-600 text-white' : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                      {state.name}
                                    </span>
                                    {selected ? (
                                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-cyan-600'
                                      }`}>
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </Combobox>
                        <ErrorMessage name="state" component="div" className="text-red-600" />
                      </div>

                      <div className="relative">
                        <Combobox value={values.city} onChange={(value) => {
                          setFieldValue('city', value);
                          setFieldValue('zipCode', '');
                        }}>
                          <div className="relative">
                            <Combobox.Input
                              className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                              placeholder="Search city..."
                              onChange={(event) => setCityQuery(event.target.value)}
                              displayValue={(city) => city || ''}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                          </div>
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredCities.map((city) => (
                              <Combobox.Option
                                key={city}
                                value={city}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-cyan-600 text-white' : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                      {city}
                                    </span>
                                    {selected ? (
                                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-cyan-600'
                                      }`}>
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </Combobox>
                        <ErrorMessage name="city" component="div" className="text-red-600" />
                      </div>

                      <div>
                        <Field 
                          name="zipCode" 
                          placeholder="Zip Code" 
                          className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        />
                        <ErrorMessage name="zipCode" component="div" className="text-red-600" />
                        {zipCodeError && <div className="text-red-600 mt-1">{zipCodeError}</div>}
                      </div>

                      <div>
                        <Field as="select" 
                          name="serviceCategory" 
                          className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        >
                          <option value="">Select Service Category</option>
                          <option value="General Contractor">General Contractor</option>
                          <option value="Electrical Contractor">Electrical Contractor</option>
                          <option value="Plumbing Contractor">Plumbing Contractor</option>
                          <option value="HVAC Contractor">HVAC Contractor</option>
                          <option value="Roofing Contractor">Roofing Contractor</option>
                        </Field>
                        <ErrorMessage name="serviceCategory" component="div" className="text-red-600" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mt-2">Years of Experience</label>
                        <Field
                          name="yearsOfExperience"
                          type="number"
                          min="0"
                          placeholder="Years of Experience"
                          className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        />
                        <ErrorMessage name="yearsOfExperience" component="div" className="text-red-600" />
                      </div>

                      <div className="mb-6">
                        <label className="block text-base font-medium text-gray-700 mb-3">Coverage Area</label>
                        <div className="relative flex flex-col gap-3 p-4 border border-white/30 rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-200">
                          <div className="flex flex-wrap gap-2" ref={(el) => {
                            if (el) {
                              el.scrollTop = el.scrollHeight;
                            }
                          }}>
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
                          </div>
                          <div className="sticky bottom-0 left-0 right-0 z-10 p-2 rounded-b-lg border-t border-white/30">
                            <input
                              type="text"
                              value={coverageAreaInput}
                              onChange={(e) => setCoverageAreaInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && coverageAreaInput.trim()) {
                                  e.preventDefault();
                                  const newAreas = [...(values.coverageArea || []), coverageAreaInput.trim()];
                                  setFieldValue('coverageArea', newAreas);
                                  setCoverageAreaInput('');
                                  // Force scroll to bottom after adding new item
                                  const container = e.target.closest('.overflow-y-auto');
                                  if (container) {
                                    setTimeout(() => {
                                      container.scrollTop = container.scrollHeight;
                                    }, 0);
                                  }
                                }
                              }}
                              placeholder="Type and press Enter to add coverage area"
                              className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                            />
                          </div>
                        </div>
                        <ErrorMessage name="coverageArea" component="div" className="text-red-600" />
                      </div>

                      <div>
                        <Field 
                          name="licenseNumber" 
                          placeholder="License Number" 
                          className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        />
                        <ErrorMessage name="licenseNumber" component="div" className="text-red-600" />
                      </div>

                      <div>
                        <Field 
                          name="insurancePolicy" 
                          placeholder="Insurance Policy" 
                          className="w-full rounded-md px-3 py-2 border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40 mt-2"
                        />
                        <ErrorMessage name="insurancePolicy" component="div" className="text-red-600" />
                      </div>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
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
