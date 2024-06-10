import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './css/login.css';

const Login = ({ onLogin }) => {
  const initialValues = {
    name: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name cannot be longer than 30 characters')
      .required('Name is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await onLogin(values.name, values.password);
    } catch (error) {
      setErrors({ general: 'Login failed: ' + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="login-form">
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
            <button type="submit" className="login-button" disabled={isSubmitting}>Login</button>
            {errors.general && <p className="error-message">{errors.general}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
