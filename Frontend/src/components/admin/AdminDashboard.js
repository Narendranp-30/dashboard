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
      const donorsResponse = await axios.get('http://localhost:5000/api/admin/donors');
      const receiversResponse = await axios.get('http://localhost:5000/api/admin/receivers');
      const requestsResponse = await axios.get('http://localhost:5000/api/admin/requests');

      setDonors(donorsResponse.data);
      setReceivers(receiversResponse.data);
      setRequests(requestsResponse.data);

      // Combine donors and receivers for all users tab
      const donorsWithType = donorsResponse.data.map(donor => ({ ...donor, type: 'Donor' }));
      const receiversWithType = receiversResponse.data.map(receiver => ({ ...receiver, type: 'Receiver' }));
      setAllUsers([...donorsWithType, ...receiversWithType]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const downloadUserData = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}'s account?`)) {
      try {
        // Delete based on user type
        const endpoint = user.type === 'Donor' 
          ? `/api/admin/donors/${user.email}`
          : `/api/admin/receivers/${user.email}`;

        await axios.delete(`http://localhost:5000${endpoint}`);
        
        // Update local state
        setAllUsers(prevUsers => prevUsers.filter(u => u.email !== user.email));
        
        // Update donors or receivers list
        if (user.type === 'Donor') {
          setDonors(prevDonors => prevDonors.filter(d => d.email !== user.email));
        } else {
          setReceivers(prevReceivers => prevReceivers.filter(r => r.email !== user.email));
        }

        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
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
          className={`tab-button ${activeTab === 'manage-users' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage-users')}
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
        {activeTab === 'manage-users' && (
          <div className="data-container">
            <div className="header-with-download">
              <h2>All Users</h2>
              <button 
                className="download-button"
                onClick={() => downloadUserData(allUsers, 'all-users')}
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
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Contact:</strong> {user.contact}</p>
                  <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                  <p><strong>Location:</strong> {user.district}, {user.city}</p>
                  <div className="card-actions">
                    <button 
                      className="download-button-small"
                      onClick={() => downloadUserData(user, `user-${user.email}`)}
                    >
                      <FaDownload /> Download
                    </button>
                    {/* <button 
                      className="delete-button-small"
                      onClick={() => handleDelete(user)}
                    >
                      <FaTrash /> Delete
                    </button> */}
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
                onClick={() => downloadUserData(donors, 'donors')}
              >
                <FaDownload /> Download Donors List
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
                onClick={() => downloadUserData(receivers, 'receivers')}
              >
                <FaDownload /> Download Receivers List
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
                onClick={() => downloadUserData(requests, 'requests')}
              >
                <FaDownload /> Download Requests List
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