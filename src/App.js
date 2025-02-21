import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';  // Import the CSS for styling

function App() {

  const [formData, setFormData] = useState({
    loginUsername: '',
    loginPassword: '',
    registerUsername: '',
    registerPassword: ''
  });

  const [formError, setFormError] = useState({
    loginUsernameError: '',
    loginPasswordError: '',
    registerUsernameError: '',
    registerPasswordError: ''
  });

  const [message, setMessage] = useState('');
  const [formType, setFormType] = useState('login');  // Track which form is shown
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // Use the useNavigate hook

  // Regex for validating email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // Regex for validating mobile number (10 digits)
  const mobileRegex = /^[0-9]{10}$/;

  // Validate Login Form
  const validateLogin = () => {
    const errors = {};
    if (!formData.loginUsername) errors.loginUsernameError = 'Username is required';
    else if (!emailRegex.test(formData.loginUsername) && !mobileRegex.test(formData.loginUsername)) {
      errors.loginUsernameError = 'Please enter a valid email or mobile number';
    }
    if (!formData.loginPassword) {
      errors.loginPasswordError = 'Password is required';
    } else if (formData.loginPassword.length < 5) {
      errors.loginPasswordError = 'Password must be at least 5 characters long';
    }

    return errors;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true during request
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      setFormError(errors); // Show errors if validation fails
      setLoading(false);  // Set loading to false after validation
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', {
        username: formData.loginUsername,
        password: formData.loginPassword,
      });
      setMessage(`${response.data.message}`);
      alert("Navigate to main page, Token is 1 hour valid automatically expire then move to login page")
    } catch (error) {
      setMessage(`${error.response?.data?.message || 'An error occurred'}`);
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  // Validate Signup Form
  const validateSignup = () => {
    const errors = {};
    if (!formData.registerUsername) errors.registerUsernameError = 'Username is required';
    if (!formData.registerPassword) errors.registerPasswordError = 'Password is required';
    if (formData.registerPassword && formData.registerPassword.length < 5) errors.registerPasswordError = 'Password must be at least 5 characters';
    return errors;
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      setFormError(errors); // Show errors if validation fails
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/user/register', {
        username: formData.registerUsername,
        password: formData.registerPassword,
      });
      setMessage(`${response.data.message}`);
    } catch (error) {
      setMessage(`${error.response?.data?.message || 'An error occurred'}`);
    }
  };

  // Handle Input Change (update form data and clear errors)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error based on the field being changed
    setFormError(prev => ({
      ...prev,
      [`${name}Error`]: ''  // Clear the specific error for the field
    }));
  };

  return (
    <div className="container">

      {/* Show the Login Form if formType is 'login' */}
      {formType === 'login' && (
        <div style={{ marginBottom: '20px' }}>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="row">
              <div className="input-container">
                <label>Username (Email or Mobile Number)</label>
                <input
                  type="text"
                  name="loginUsername"
                  value={formData.loginUsername}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
                {formError.loginUsernameError && <p className="error">{formError.loginUsernameError}</p>}
              </div>
            </div>

            <div className="row">
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  name="loginPassword"
                  value={formData.loginPassword}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                {formError.loginPasswordError && <p className="error">{formError.loginPasswordError}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading}>Login</button>
          </form>

          <div>
            <a href="#" onClick={() => {
              setFormType('signup'); setMessage(''); setFormData({
                loginUsername: '',
                loginPassword: '',
                registerUsername: '',
                registerPassword: ''
              });
            }}>Don't have an account? Signup</a>
          </div>
        </div>
      )}

      {/* Show the Signup Form if formType is 'signup' */}
      {formType === 'signup' && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Signup</h2>
          <form onSubmit={handleRegister}>

            <div className="row">
              <div className="input-container">
                <label>Username</label>
                <input
                  type="text"
                  name="registerUsername"
                  value={formData.registerUsername}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
                {formError.registerUsernameError && <p className="error">{formError.registerUsernameError}</p>}
              </div>
            </div>

            <div className="row">
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  name="registerPassword"
                  value={formData.registerPassword}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                {formError.registerPasswordError && <p className="error">{formError.registerPasswordError}</p>}
              </div>
            </div>
            <button type="submit" disabled={loading}>Signup</button>
          </form>
          <div>
            <a href="#" onClick={() => {
              setFormType('login'); setMessage(''); setFormData({
                loginUsername: '',
                loginPassword: '',
                registerUsername: '',
                registerPassword: ''
              });
            }}>Already have an account? Login</a>
          </div>
        </div>
      )}

      {message && <div className="message"><strong>{message}</strong></div>}
    </div>
  );
}

export default App;
