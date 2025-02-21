import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { validatePassword, validateEmail, validatePhoneNumber } from '../../utils/validation';
import '../../styles/Login.scss'; // Import the same SCSS for styles

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.errors;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      setSuccessMessage('Signup Successful! Please login to continue.');
      setFormData({
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Signup failed. Please try again.'
      }));
    }
  };

  return (
    <div className="login-page">
    <div className="container">
      <div className="login-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="site__logo"
          width="56"
          height="84"
          viewBox="77.7 214.9 274.7 412"
        >
          <defs>
            <linearGradient id="a" x1="0%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#8ceabb" />
              <stop offset="100%" stopColor="#378f7b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#a)"
            d="M215 214.9c-83.6 123.5-137.3 200.8-137.3 275.9 0 75.2 61.4 136.1 137.3 136.1s137.3-60.9 137.3-136.1c0-75.1-53.7-152.4-137.3-275.9z"
          />
        </svg>

        <h2>Sign Up</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form__field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form__field">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (10 digits)"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
              maxLength="10"
            />
            {errors.phoneNumber && (
              <div className="error-text">
                {Array.isArray(errors.phoneNumber) 
                  ? errors.phoneNumber.map((err, index) => (
                      <div key={index}>{err}</div>
                    ))
                  : errors.phoneNumber}
              </div>
            )}
          </div>
          <div className="form__field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <div className="error-text">
                {Array.isArray(errors.password) 
                  ? errors.password.map((err, index) => (
                      <div key={index}>{err}</div>
                    ))
                  : errors.password}
              </div>
            )}
          </div>
          <div className="form__field">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          {errors.submit && <div className="error-text">{errors.submit}</div>}
          <div className="form__field">
            <input type="submit" value="Sign Up" />
          </div>
        </form>
        
        <p>
          Already have an account?{' '}
          <Link to="/login" className="signup-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Signup;
