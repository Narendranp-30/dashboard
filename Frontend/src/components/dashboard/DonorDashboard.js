import React from 'react';
import SideNav from './SideNav';
import Home from '../pages/Home'; // Import the Home component
import '../../styles/Dashboard.scss';

const DonorDashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SideNav />

      {/* Dashboard Content */}
      <div className="dashboard__content">
        {/* Home Content */}
        <Home />
      </div>
    </div>
  );
};

export default DonorDashboard;
