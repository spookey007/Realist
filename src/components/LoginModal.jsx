import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import '../assets/css/modal.css';
import backgroundImg from '../assets/images/contact_form/contact_form.jpeg';
import { useAuth } from '../context/AuthContext'; // Import context
const now = new Date();
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const LoginModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const [selectedDateTime, setSelectedDateTime] = useState(startOfToday);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const recaptchaRef = useRef();
  const { login } = useAuth(); // Use context login function

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
    address: '',
    dateTime: null,
    captchaValue: '',
  };

  const validationSchema = Yup.object({
    // name: Yup.string().required('Name is required'),
    email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),

    // phone: Yup.string().required('Phone number is required'),
    // message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters long'),
    // address: Yup.string().required('Address is required'),
    // dateTime: Yup.date().required('Please select a date and time').min(startOfToday, 'Date must be today or later'),
    captchaValue: Yup.string().required('Please complete the reCAPTCHA'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    let data
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
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
      data = await response.json();
      if (response.ok) {
        alertify.success('User login successful!');
  
        login(data.user, data.token); // ✅ Call context login to set user globally
        resetForm();
        recaptchaRef.current.reset();
        closeModal();
        navigate('/dashboard'); // Redirect
      } else {
        alertify.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.log(error);
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
    isOpen && (
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{
            background: 'white',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button className="close-modal" onClick={closeModal}>
            &times;
          </button>
          <h2 className="modal-title">Sign In</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field type="email" id="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field type="password" id="password" name="password" className="form-control" />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                  </div>

                <div className="form-group">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(value) => setFieldValue('captchaValue', value)}
                  />
                  <ErrorMessage name="captchaValue" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      
    )
  );
};

export default LoginModal;
