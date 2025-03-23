import React, { useRef, useState,useEffect } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { FilePond, registerPlugin } from 'react-filepond';
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

const Invite = () => {
    const navigate = useNavigate();
    const [isOpen, setisOpen] = useState('');
    // const [isModalOpen, setIsModalOpen] = useState(true);
    const { id } = useParams(); // Invite ID from URL
    const [inviteValid, setInviteValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inviteData, setInviteData] = useState(null); // to store invite if you want to prefill data later
    const [Error, setError] = useState(''); // ✅ Correct way to track error
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

  const closeModal = () => {
    setisOpen(false);
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log("submission received:", values);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/registerContractor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          dateTime: selectedDateTime,
          latitude: location.latitude,
          longitude: location.longitude,
          invite_id:id
        }),
      });
      const responseData = await response.json();
      // console.log(responseData)
      if (response.ok)
        {
          resetForm(); // reset Formik
          setActiveStep(0); // reset stepper
          recaptchaRef.current.reset(); // reset captcha
          filePondRef.current.removeFiles(); // ✅ reset FilePond files
          closeModal?.();
          alertify.alert(
            "Thank You for Registering!",
            `
            <p>We have received your contractor registration request on <strong>Realist</strong>. Our team is currently reviewing your application to ensure everything is in order.</p>
            <p>You will receive a confirmation email once your account has been approved and activated.</p>
            <p>In the meantime, if you have any questions, feel free to reach out to us.</p>
            `, function () {
            alertify.message("OK");
            navigate("/"); // Navigate to the home page after clicking OK
          });
        // alertify.success('User created successfully!');
        
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

//   useEffect(() => {
//     fetchLocation();
//   }, []);

useEffect(() => {
    const checkInvite = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invites/${id}`);
        const data = await response.json();

        if (response.ok) {
          
          setInviteValid(true);
          setInviteData(data.invite);
          setisOpen(true);
          // console.log(inviteData.email)
        } else {
          alertify.error(data.message || 'Invitation invalid or expired.');
          setInviteValid(false);
          setisOpen(false);
          setError(data.message)
        }
      } catch (error) {
        setError(error)
        console.error('Error fetching invite:', error);
        alertify.error('Failed to validate invitation. Please try again later.');
        setInviteValid(false);
        setError("Something went wrong please contact admin")
        setisOpen(false);
      } finally {
        setLoading(false);
      }
    };

    checkInvite();
  }, [id]);

  if (Error) {
    return <p className="text-center text-red-500 mt-8 font-bold">{Error}</p>; // ✅ Now will render if error exists
  }
  
//   console.log(isOpen)
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-modal" onClick={closeModal}>&times;</button>
          <h2 className="modal-title">Registration Form </h2>
          <p className="text-center text-sm text-gray-500 my-2 font-semibold">For Contractor</p>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <Formik
              initialValues={{
                fullName: '',
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
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>Submit</Button>
                  ) : (
                    <Button
                      onClick={() => handleNext(validateForm, values, setTouched)}
                      variant="contained"
                      color="primary"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
};

export default Invite;
