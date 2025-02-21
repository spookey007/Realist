import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import '../assets/css/modal.css';
import backgroundImg from '../assets/images/contact_form/contact_form.jpeg';

const now = new Date();
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const ContactModal = ({ isOpen, closeModal }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(startOfToday);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const recaptchaRef = useRef();

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
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters long'),
    address: Yup.string().required('Address is required'),
    dateTime: Yup.date().required('Please select a date and time').min(startOfToday, 'Date must be today or later'),
    captchaValue: Yup.string().required('Please complete the reCAPTCHA'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointment/save`, {
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

      if (response.ok) {
        alertify.success('Message Sent Successfully!');
        resetForm();
        recaptchaRef.current.reset();
        closeModal();
      } else {
        alertify.error('Failed to send message.');
      }
    } catch (error) {
      alertify.error('Error sending email. Please try again.');
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
    fetchLocation();
  }, []);

  return (
    isOpen && (
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button className="close-modal" onClick={closeModal}>
            &times;
          </button>
          <h2 className="modal-title">Book Appointment</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Field type="text" id="name" name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Field type="email" id="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <Field type="text" id="phone" name="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>
                <div className="form-group">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <Field type="text" id="address" name="address" className="form-control" />
                  <ErrorMessage name="address" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <Field as="textarea" id="message" name="message" className="form-control" rows="4" />
                  <ErrorMessage name="message" component="div" className="text-red-600 text-sm font-semibold mt-1" />
                </div>
                <div className="form-group">
                  <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Select Date & Time</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                      value={selectedDateTime}
                      onChange={(newValue) => {
                        setSelectedDateTime(newValue);
                        setFieldValue('dateTime', newValue);
                      }}
                      minDate={startOfToday}
                      renderInput={(params) => <Field as="input" {...params} className="form-control" />}
                    />
                  </LocalizationProvider>
                  <ErrorMessage name="dateTime" component="div" className="text-red-600 text-sm font-semibold mt-1" />
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
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
};

export default ContactModal;
