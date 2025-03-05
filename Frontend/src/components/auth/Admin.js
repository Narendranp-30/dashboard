import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.scss';

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Default admin credentials
  const ADMIN_EMAIL = 'admin@bloodbank.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store admin status in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email);
      
      // Navigate to admin dashboard
      navigate('/admin-dashboard');
    } else {
      setErrorMessage('Invalid admin credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__field">
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <input type="submit" value="Login as Admin" />
            </div>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>
            Not an admin? <a href="/login">Return to regular login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin; 