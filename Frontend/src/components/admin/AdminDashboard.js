import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminDashboard.scss';

function AdminDashboard() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      // Fetch all donors
      const donorsResponse = await axios.get('http://localhost:5000/api/admin/donors');
      setDonors(donorsResponse.data);

      // Fetch all receivers
      const receiversResponse = await axios.get('http://localhost:5000/api/admin/receivers');
      setReceivers(receiversResponse.data);

      // Fetch all requests
      const requestsResponse = await axios.get('http://localhost:5000/api/admin/requests');
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'donors' ? 'active' : ''}`}
          onClick={() => setActiveTab('donors')}
        >
          Donors
        </button>
        <button 
          className={`tab-button ${activeTab === 'receivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('receivers')}
        >
          Receivers
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Blood Requests
        </button>
      </div>

      <div className="content-container">
        {activeTab === 'donors' && (
          <div className="data-container">
            <h2>Registered Donors</h2>
            <div className="cards-grid">
              {donors.map((donor, index) => (
                <div key={index} className="user-card">
                  <h3>{donor.name}</h3>
                  <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                  <p><strong>Email:</strong> {donor.email}</p>
                  <p><strong>Contact:</strong> {donor.contact}</p>
                  <p><strong>Location:</strong> {donor.district}, {donor.city}</p>
                  <p><strong>Age:</strong> {donor.age}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${donor.teetotaler ? 'active' : 'inactive'}`}>
                      {donor.teetotaler ? 'Teetotaler' : 'Non-Teetotaler'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'receivers' && (
          <div className="data-container">
            <h2>Registered Receivers</h2>
            <div className="cards-grid">
              {receivers.map((receiver, index) => (
                <div key={index} className="user-card">
                  <h3>{receiver.name}</h3>
                  <p><strong>Blood Group:</strong> {receiver.bloodGroup}</p>
                  <p><strong>Email:</strong> {receiver.email}</p>
                  <p><strong>Contact:</strong> {receiver.contact}</p>
                  <p><strong>Location:</strong> {receiver.district}, {receiver.city}</p>
                  <p><strong>Age:</strong> {receiver.age}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="data-container">
            <h2>Blood Requests</h2>
            <div className="cards-grid">
              {requests.map((request, index) => (
                <div key={index} className="request-card">
                  <h3>Request #{index + 1}</h3>
                  <p><strong>From:</strong> {request.senderEmail}</p>
                  <p><strong>To:</strong> {request.receiverEmail}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${request.status}`}>
                      {request.status}
                    </span>
                  </p>
                  <p><strong>Message:</strong> {request.message}</p>
                  <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 