import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminDashboard.scss';
import { FaDownload, FaUser, FaUserPlus, FaTrash } from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      // Fetch all data
      const [donorsRes, receiversRes, requestsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/donors'),
        axios.get('http://localhost:5000/api/admin/receivers'),
        axios.get('http://localhost:5000/api/admin/requests')
      ]);

      setDonors(donorsRes.data);
      setReceivers(receiversRes.data);
      setRequests(requestsRes.data);

      // Combine and format users for the manage users tab
      const donorUsers = donorsRes.data.map(donor => ({
        ...donor,
        type: 'Donor'
      }));
      const receiverUsers = receiversRes.data.map(receiver => ({
        ...receiver,
        type: 'Receiver'
      }));
      setAllUsers([...donorUsers, ...receiverUsers]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const downloadData = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const downloadUserData = (user) => {
    const jsonString = JSON.stringify(user, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${user.name}-data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleDelete = async (userId, userType) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/${userType.toLowerCase()}s/${userId}`);
        // Refresh data after deletion
        fetchAllData();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Users
        </button>
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
        {activeTab === 'manage' && (
          <div className="data-container">
            <div className="header-with-download">
              <h2>All Users</h2>
              <button 
                className="download-button"
                onClick={() => downloadData(allUsers, 'all-users')}
              >
                <FaDownload /> Download All Users
              </button>
            </div>
            <div className="cards-grid">
              {allUsers.map((user, index) => (
                <div key={index} className="user-card">
                  <div className="card-header">
                    <h3>{user.name}</h3>
                    <span className={`user-type ${user.type.toLowerCase()}`}>
                      {user.type === 'Donor' ? <FaUserPlus /> : <FaUser />}
                      {user.type}
                    </span>
                  </div>
                  <div className="card-content">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Contact:</strong> {user.contact}</p>
                    <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                    <p><strong>Location:</strong> {user.district}, {user.city}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="action-button download"
                      onClick={() => downloadUserData(user)}
                    >
                      <FaDownload /> Download
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(user._id, user.type)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donors' && (
          <div className="data-container">
            <div className="header-with-download">
              <h2>Registered Donors</h2>
              <button 
                className="download-button"
                onClick={() => downloadData(donors, 'donors-data')}
              >
                <FaDownload /> Download Donors Data
              </button>
            </div>
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
                  <div className="card-actions">
                    <button 
                      className="action-button download"
                      onClick={() => downloadUserData(donor)}
                    >
                      <FaDownload /> Download
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(donor._id, 'Donor')}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'receivers' && (
          <div className="data-container">
            <div className="header-with-download">
              <h2>Registered Receivers</h2>
              <button 
                className="download-button"
                onClick={() => downloadData(receivers, 'receivers-data')}
              >
                <FaDownload /> Download Receivers Data
              </button>
            </div>
            <div className="cards-grid">
              {receivers.map((receiver, index) => (
                <div key={index} className="user-card">
                  <h3>{receiver.name}</h3>
                  <p><strong>Blood Group:</strong> {receiver.bloodGroup}</p>
                  <p><strong>Email:</strong> {receiver.email}</p>
                  <p><strong>Contact:</strong> {receiver.contact}</p>
                  <p><strong>Location:</strong> {receiver.district}, {receiver.city}</p>
                  <p><strong>Age:</strong> {receiver.age}</p>
                  <div className="card-actions">
                    <button 
                      className="action-button download"
                      onClick={() => downloadUserData(receiver)}
                    >
                      <FaDownload /> Download
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(receiver._id, 'Receiver')}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="data-container">
            <div className="header-with-download">
              <h2>Blood Requests</h2>
              <button 
                className="download-button"
                onClick={() => downloadData(requests, 'requests-data')}
              >
                <FaDownload /> Download Requests Data
              </button>
            </div>
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