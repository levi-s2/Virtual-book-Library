import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './css/register.css';

const Register = ({ onRegister }) => {
  const initialValues = {
    name: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
    try {
      await onRegister(values.name, values.password);
      setStatus({ success: 'Registration successful!' });
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Registration failed: ' + error.message });
      setStatus({ success: null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, errors }) => (
          <Form className="register-form">
            <div className="form-group">
              <label>Name:</label>
              <Field name="name" type="text" className="form-input" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <Field name="password" type="password" className="form-input" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            <button type="submit" className="register-button" disabled={isSubmitting}>Register</button>
            {status && status.success && <p className="success-message">{status.success}</p>}
            {errors.general && <p className="error-message">{errors.general}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
