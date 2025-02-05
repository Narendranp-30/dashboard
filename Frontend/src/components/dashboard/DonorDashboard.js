import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorForm from '../pages/DonorForm';
import { AuthContext } from '../Context/AuthContext';
import '../../styles/Dashboard.scss';
import SideNav2 from './SideNav2';

const DonorDashboard = () => {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserRole = localStorage.getItem('userRole');
    if (savedUserRole !== 'donor') {
      navigate('/login');
    }
  }, [userRole, navigate]);

  return (
    <div className="dashboard">
      <SideNav2 />
      <div className="dashboard__content">
        <h1>Donor Dashboard</h1>
        <DonorForm />
      </div>
    </div>
  );
};

export default DonorDashboard;
