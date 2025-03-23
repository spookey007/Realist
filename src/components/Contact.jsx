// src/components/Contact.jsx

import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import backgroundImg from '../assets/images/services/background.jpeg'; // Adjust this path to your background image
import contact_form_img from '../assets/images/contact_form/contact_form.jpeg';

const Contact = () => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const recaptchaRef = useRef();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be 50 characters or less')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(
        /^[0-9]{10,15}$/,
        'Phone number must be between 10 and 15 digits and contain only numbers'
      )
      .required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, captchaValue }),
      });

      if (response.ok) {
        setSubmitted(true);
        resetForm();
        recaptchaRef.current.reset();
        setCaptchaValue(null);
        alertify.success('Message sent successfully!', 7);
      } else {
        alertify.error('Something went wrong, please try again.', 7);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alertify.error('Error submitting the form, please try again later.', 7);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      className="flex bg-gray-100 py-10" 
      style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Contact Us</h2>
        {submitted && <p className="text-green-500 text-center">Message sent successfully!</p>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit} 
        >
          {({ isSubmitting }) => (
            <Form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md" style={{ backgroundImage: `url(${contact_form_img})`, backgroundSize: 'cover' }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Field type="text" name="name" className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500" />
                <ErrorMessage name="name" component="div" className="text-red-600 text-sm font-semibold mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Field type="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500" />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm font-semibold mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Field type="text" name="phone" className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500" />
                <ErrorMessage name="phone" component="div" className="text-red-600 text-sm font-semibold mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <Field as="textarea" name="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500" />
                <ErrorMessage name="message" component="div" className="text-red-600 text-sm font-semibold mt-1" />
              </div>

              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Use the site key from .env
                onChange={setCaptchaValue}
                className="mb-4"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring focus:ring-blue-500`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Contact;
