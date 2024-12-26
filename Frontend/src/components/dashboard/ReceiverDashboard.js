import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import '../../styles/Dashboard.scss';

const ReceiverDashboard = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Get the logged-in user's email from localStorage
    const email = localStorage.getItem('userEmail');
    setUserEmail(email); // Set the email in state
  }, []);

  return (
    <div className="dashboard">
      <SideNav />
      <div className="dashboard__content">
        <h1>Welcome to the Receiver Dashboard</h1>
        {userEmail ? (
          <p>Welcome, {userEmail}. Select a menu option to get started.</p>
        ) : (
          <p>Welcome, User. Select a menu option to get started.</p> // Fallback if email is not available
        )}
      </div>
    </div>
  );
};

export default ReceiverDashboard;
