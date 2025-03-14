import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminDashboard.scss';
import { FaDownload, FaUser, FaUserPlus, FaTrash, FaFilter } from 'react-icons/fa';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import jsPDF from 'jspdf';

function AdminDashboard() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');
  const [allUsers, setAllUsers] = useState([]);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    state: '',
    city: '',
    district: ''
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
    fetchAllData();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [filters, allUsers]);

  const applyFilters = () => {
    let filtered = allUsers;
    
    if (filters.bloodGroup) {
      filtered = filtered.filter(user => user.bloodGroup === filters.bloodGroup);
    }
    if (filters.state) {
      filtered = filtered.filter(user => user.state?.toLowerCase().includes(filters.state.toLowerCase()));
    }
    if (filters.city) {
      filtered = filtered.filter(user => user.city?.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.district) {
      filtered = filtered.filter(user => user.district?.toLowerCase().includes(filters.district.toLowerCase()));
    }
    
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const fetchAllData = async () => {
    try {
      const [donorsRes, receiversRes, requestsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/donors'),
        axios.get('http://localhost:5000/api/admin/receivers'),
        axios.get('http://localhost:5000/api/admin/requests')
      ]);

      setDonors(donorsRes.data);
      setReceivers(receiversRes.data);
      setRequests(requestsRes.data);

      const donorUsers = donorsRes.data.map(donor => ({
        ...donor,
        type: 'Donor'
      }));
      const receiverUsers = receiversRes.data.map(receiver => ({
        ...receiver,
        type: 'Receiver'
      }));
      const combinedUsers = [...donorUsers, ...receiverUsers];
      setAllUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const downloadUserPDF = (user) => {
    const doc = new jsPDF();
    const lineHeight = 10;
    let yPos = 20;

    // Add title
    doc.setFontSize(16);
    doc.text(`User Details - ${user.name}`, 20, yPos);
    yPos += lineHeight * 2;

    // Add user information
    doc.setFontSize(12);
    doc.text(`Type: ${user.type}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Email: ${user.email}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Contact: ${user.contact}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Blood Group: ${user.bloodGroup}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Age: ${user.age}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Location: ${user.district}, ${user.city}, ${user.state}`, 20, yPos);
    yPos += lineHeight * 2;

    // Add donation history if user is a donor
    if (user.type === 'Donor') {
      doc.setFontSize(14);
      doc.text('Donation History', 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      if (user.donationHistory && user.donationHistory.length > 0) {
        user.donationHistory.forEach(donation => {
          doc.text(`Date: ${new Date(donation.date).toLocaleDateString()}`, 20, yPos);
          yPos += lineHeight;
          doc.text(`Location: ${donation.location}`, 20, yPos);
          yPos += lineHeight;
          doc.text(`Recipient: ${donation.recipient || 'Not specified'}`, 20, yPos);
          yPos += lineHeight * 1.5;
        });
      } else {
        doc.text('No donation history available', 20, yPos);
      }
    }

    doc.save(`${user.name}-details.pdf`);
  };

  const downloadAllDataPDF = (data, filename) => {
    const doc = new jsPDF();
    const lineHeight = 10;
    let yPos = 20;

    // Add title
    doc.setFontSize(16);
    doc.text(`${filename}`, 20, yPos);
    yPos += lineHeight * 2;

    // Add data
    doc.setFontSize(12);
    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name || 'User ' + (index + 1)}`, 20, yPos);
      yPos += lineHeight;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      if (item.email) doc.text(`   Email: ${item.email}`, 30, yPos); yPos += lineHeight;
      if (item.bloodGroup) doc.text(`   Blood Group: ${item.bloodGroup}`, 30, yPos); yPos += lineHeight;
      if (item.contact) doc.text(`   Contact: ${item.contact}`, 30, yPos); yPos += lineHeight;
      if (item.district || item.city || item.state) {
        doc.text(`   Location: ${[item.district, item.city, item.state].filter(Boolean).join(', ')}`, 30, yPos);
        yPos += lineHeight;
      }
      
      yPos += lineHeight/2;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`${filename}.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const handleDelete = async (userId, userType) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/${userType.toLowerCase()}s/${userId}`);
        fetchAllData();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const FilterSection = () => (
    <div className="filter-section">
      <FormControl size="small" style={{ minWidth: 120, marginRight: 10 }}>
        <InputLabel>Blood Group</InputLabel>
        <Select
          name="bloodGroup"
          value={filters.bloodGroup}
          onChange={handleFilterChange}
          label="Blood Group"
        >
          <MenuItem value="">All</MenuItem>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
            <MenuItem key={group} value={group}>{group}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="State"
        name="state"
        value={filters.state}
        onChange={handleFilterChange}
        style={{ marginRight: 10 }}
      />
      <TextField
        size="small"
        label="City"
        name="city"
        value={filters.city}
        onChange={handleFilterChange}
        style={{ marginRight: 10 }}
      />
      <TextField
        size="small"
        label="District"
        name="district"
        value={filters.district}
        onChange={handleFilterChange}
      />
    </div>
  );

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
              <FilterSection />
            </div>
            <div className="cards-grid">
              {filteredUsers.map((user, index) => (
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
                    <p><strong>Location:</strong> {user.district}, {user.city}, {user.state}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="action-button download"
                      onClick={() => downloadUserPDF(user)}
                    >
                      <FaDownload /> Download PDF
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
                onClick={() => downloadAllDataPDF(donors, 'donors-data')}
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
                      onClick={() => downloadUserPDF(donor)}
                    >
                      <FaDownload /> Download PDF
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
                onClick={() => downloadAllDataPDF(receivers, 'receivers-data')}
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
                      onClick={() => downloadUserPDF(receiver)}
                    >
                      <FaDownload /> Download PDF
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
                onClick={() => downloadAllDataPDF(requests, 'requests-data')}
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