// DonorDashboard.jsx or ReceiverDashboard.jsx
import React from 'react';
import SideNav from './SideNav';
import '../../styles/Dashboard.scss';
const DonorDashboard = () => {
  return (
    <div className="dashboard">
      <SideNav />
      <div className="dashboard__content">
        <h1>Welcome to the Donor Dashboard</h1>
        <p>Select a menu option to get started.</p>
      </div>
    </div>
  );
};

export default DonorDashboard;
