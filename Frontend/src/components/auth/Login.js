import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiver'); // Role selection default to 'receiver'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send email, password, and selected role to the backend
      const response = await axios.post('http://localhost:5000/api/login', { email, password, role });
      const user = response.data.user;

      // Store user data in localStorage for later use
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', role);

      // Navigate based on role
      if (role === 'donor') {
        navigate('/donor-dashboard');
      } else if (role === 'receiver') {
        navigate('/receiver-dashboard');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__field">
              <input
                type="email"
                placeholder="info@mailaddress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="form__select"
              >
                <option value="receiver">Receiver</option>
                <option value="donor">Donor</option>
              </select>
            </div>
            <div className="form__field">
              <input type="submit" value="Login" />
            </div>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
