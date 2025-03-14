import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminDashboard.scss';
import { FaDownload, FaUser, FaUserPlus, FaTrash, FaFilter } from 'react-icons/fa';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import jsPDF from 'jspdf';
import locationData from '../pages/data.json';

function AdminDashboard() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('donors');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    state: '',
    district: '',
    city: ''
  });
  
  // Derived data from location data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Extract unique states from location data
    const uniqueStates = [...new Set(locationData.map(item => item.State))].sort();
    setStates(uniqueStates);
  }, []);

  useEffect(() => {
    // Update districts based on selected state
    if (filters.state) {
      const stateDistricts = [...new Set(
        locationData
          .filter(item => item.State === filters.state)
          .map(item => item.District)
      )].sort();
      setDistricts(stateDistricts);
      setFilters({
        ...filters,
        district: '',
        city: ''
      });
    } else {
      setDistricts([]);
      setFilters({
        ...filters,
        district: '',
        city: ''
      });
    }
  }, [filters.state]);

  useEffect(() => {
    // Update cities based on selected district and state
    if (filters.state && filters.district) {
      const districtCities = [...new Set(
        locationData
          .filter(item => item.State === filters.state && item.District === filters.district)
          .map(item => item.City)
      )].sort();
      setCities(districtCities);
      setFilters({
        ...filters,
        city: ''
      });
    } else {
      setCities([]);
      setFilters({
        ...filters,
        city: ''
      });
    }
  }, [filters.state, filters.district]);

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
      
      if (filters.district) {
        filtered = filtered.filter(user => user.district?.toLowerCase().includes(filters.district.toLowerCase()));
        
        if (filters.city) {
          filtered = filtered.filter(user => user.city?.toLowerCase().includes(filters.city.toLowerCase()));
        }
      }
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
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set initial position and spacing
      let yPos = 20;
      const lineHeight = 10;
      const margin = 20;
      
      // Add header with styling
      doc.setFillColor(41, 128, 185); // Blue header
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Blood Donation Management System', margin, 10);
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add title with user name
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`User Details: ${user.name || 'Unknown User'}`, margin, yPos);
      yPos += lineHeight * 2;
      
      // Add user information section
      doc.setFillColor(236, 240, 241); // Light gray background
      doc.rect(margin - 5, yPos - 5, 170, 70, 'F');
      
      // Add user details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Helper function to add a line of text
      const addLine = (label, value) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`${value || 'Not provided'}`, margin + 40, yPos);
        yPos += lineHeight;
      };
      
      // Add user information
      addLine('User Type', user.type || 'N/A');
      addLine('Email', user.email || 'N/A');
      addLine('Contact', user.contact || 'N/A');
      addLine('Blood Group', user.bloodGroup || 'N/A');
      addLine('Age', user.age || 'N/A');
      
      // Format location with available fields
      const location = [user.district, user.city, user.state]
        .filter(item => item && item.trim() !== '')
        .join(', ');
      addLine('Location', location || 'N/A');
      
      yPos += lineHeight;
      
      // Add donation history if user is a donor
      if (user.type === 'Donor') {
        yPos += lineHeight;
        
        // Add donation history header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Donation History', margin, yPos);
        yPos += lineHeight * 1.5;
        
        // Add donation history content
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        if (user.donationHistory && user.donationHistory.length > 0) {
          // Add table header
          const tableTop = yPos;
          doc.setFillColor(189, 195, 199); // Light gray for header
          doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.text('Date', margin, yPos);
          doc.text('Location', margin + 50, yPos);
          doc.text('Recipient', margin + 100, yPos);
          yPos += lineHeight * 1.5;
          
          // Add table rows
          user.donationHistory.forEach((donation, index) => {
            const rowColor = index % 2 === 0 ? 245 : 255; // Alternate row colors
            doc.setFillColor(rowColor, rowColor, rowColor);
            doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
            
            const donationDate = donation.date ? new Date(donation.date).toLocaleDateString() : 'N/A';
            doc.setFont('helvetica', 'normal');
            doc.text(donationDate, margin, yPos);
            doc.text(donation.location || 'N/A', margin + 50, yPos);
            doc.text(donation.recipient || 'N/A', margin + 100, yPos);
            yPos += lineHeight;
            
            // Add new page if needed
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
              
              // Add header to new page
              doc.setFillColor(41, 128, 185);
              doc.rect(0, 0, 210, 15, 'F');
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(14);
              doc.setFont('helvetica', 'bold');
              doc.text('Blood Donation Management System - Continued', margin, 10);
              doc.setTextColor(0, 0, 0);
              yPos += 10;
            }
          });
        } else {
          doc.text('No donation history available', margin, yPos);
        }
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`, 
          doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`${user.name || 'user'}-details.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const downloadAllDataPDF = (data, filename) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set initial position and spacing
      let yPos = 20;
      const lineHeight = 10;
      const margin = 20;
      
      // Add header with styling
      doc.setFillColor(41, 128, 185); // Blue header
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Blood Donation Management System', margin, 10);
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${filename.replace('-data', ' Data')}`, margin, yPos);
      yPos += lineHeight * 2;
      
      // Add data
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (data.length === 0) {
        doc.text('No data available', margin, yPos);
      } else {
        // Add table header
        doc.setFillColor(189, 195, 199); // Light gray for header
        doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Name', margin, yPos);
        doc.text('Blood Group', margin + 50, yPos);
        doc.text('Contact', margin + 90, yPos);
        doc.text('Location', margin + 130, yPos);
        yPos += lineHeight * 1.5;
        
        // Add table rows
        data.forEach((item, index) => {
          // Add new page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            
            // Add header to new page
            doc.setFillColor(41, 128, 185);
            doc.rect(0, 0, 210, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Blood Donation Management System - Continued', margin, 10);
            doc.setTextColor(0, 0, 0);
            
            // Add table header to new page
            yPos = 30;
            doc.setFillColor(189, 195, 199);
            doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text('Name', margin, yPos);
            doc.text('Blood Group', margin + 50, yPos);
            doc.text('Contact', margin + 90, yPos);
            doc.text('Location', margin + 130, yPos);
            yPos += lineHeight * 1.5;
          }
          
          // Alternate row colors
          const rowColor = index % 2 === 0 ? 245 : 255;
          doc.setFillColor(rowColor, rowColor, rowColor);
          doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
          
          // Add row data
          doc.setFont('helvetica', 'normal');
          doc.text(item.name || `User ${index + 1}`, margin, yPos);
          doc.text(item.bloodGroup || 'N/A', margin + 50, yPos);
          doc.text(item.contact || 'N/A', margin + 90, yPos);
          
          // Format location with available fields
          const location = [item.district, item.city, item.state]
            .filter(loc => loc && loc.trim() !== '')
            .join(', ');
          
          // Truncate location if too long
          const maxLocationLength = 25;
          const displayLocation = location.length > maxLocationLength 
            ? location.substring(0, maxLocationLength) + '...' 
            : location || 'N/A';
            
          doc.text(displayLocation, margin + 130, yPos);
          yPos += lineHeight * 1.2;
        });
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`, 
          doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const downloadRequestsPDF = (requests) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set initial position and spacing
      let yPos = 20;
      const lineHeight = 10;
      const margin = 20;
      
      // Add header with styling
      doc.setFillColor(41, 128, 185); // Blue header
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Blood Donation Management System', margin, 10);
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Blood Requests Data', margin, yPos);
      yPos += lineHeight * 2;
      
      // Add data
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (requests.length === 0) {
        doc.text('No requests available', margin, yPos);
      } else {
        // Add table header
        doc.setFillColor(189, 195, 199); // Light gray for header
        doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('From', margin, yPos);
        doc.text('To', margin + 50, yPos);
        doc.text('Status', margin + 100, yPos);
        doc.text('Date', margin + 140, yPos);
        yPos += lineHeight * 1.5;
        
        // Add table rows
        requests.forEach((request, index) => {
          // Add new page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            
            // Add header to new page
            doc.setFillColor(41, 128, 185);
            doc.rect(0, 0, 210, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Blood Donation Management System - Continued', margin, 10);
            doc.setTextColor(0, 0, 0);
            
            // Add table header to new page
            yPos = 30;
            doc.setFillColor(189, 195, 199);
            doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text('From', margin, yPos);
            doc.text('To', margin + 50, yPos);
            doc.text('Status', margin + 100, yPos);
            doc.text('Date', margin + 140, yPos);
            yPos += lineHeight * 1.5;
          }
          
          // Alternate row colors
          const rowColor = index % 2 === 0 ? 245 : 255;
          doc.setFillColor(rowColor, rowColor, rowColor);
          doc.rect(margin - 5, yPos - 5, 170, 10, 'F');
          
          // Add row data
          doc.setFont('helvetica', 'normal');
          
          // Truncate emails if too long
          const maxEmailLength = 20;
          const fromEmail = request.senderEmail || 'N/A';
          const toEmail = request.receiverEmail || 'N/A';
          
          const displayFromEmail = fromEmail.length > maxEmailLength 
            ? fromEmail.substring(0, maxEmailLength) + '...' 
            : fromEmail;
            
          const displayToEmail = toEmail.length > maxEmailLength 
            ? toEmail.substring(0, maxEmailLength) + '...' 
            : toEmail;
          
          doc.text(displayFromEmail, margin, yPos);
          doc.text(displayToEmail, margin + 50, yPos);
          doc.text(request.status || 'N/A', margin + 100, yPos);
          
          const requestDate = request.createdAt 
            ? new Date(request.createdAt).toLocaleDateString() 
            : 'N/A';
          doc.text(requestDate, margin + 140, yPos);
          
          yPos += lineHeight * 1.2;
          
          // Add message on next line if it exists
          if (request.message) {
            yPos += lineHeight * 0.5;
            doc.setFont('helvetica', 'bold');
            doc.text('Message:', margin, yPos);
            yPos += lineHeight;
            
            // Handle long messages with word wrapping
            const maxWidth = 160;
            const splitMessage = doc.splitTextToSize(request.message, maxWidth);
            doc.setFont('helvetica', 'normal');
            
            splitMessage.forEach(line => {
              doc.text(line, margin, yPos);
              yPos += lineHeight;
              
              // Add new page if needed
              if (yPos > 270) {
                doc.addPage();
                yPos = 20;
                
                // Add header to new page
                doc.setFillColor(41, 128, 185);
                doc.rect(0, 0, 210, 15, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Blood Donation Management System - Continued', margin, 10);
                doc.setTextColor(0, 0, 0);
                yPos += 10;
              }
            });
            
            yPos += lineHeight * 0.5;
          }
        });
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`, 
          doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: 'center' });
      }
      
      // Save the PDF
      doc.save('blood-requests-data.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
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
      <FormControl size="small">
        <InputLabel id="blood-group-label">Blood Group</InputLabel>
        <Select
          labelId="blood-group-label"
          id="blood-group"
          value={filters.bloodGroup}
          label="Blood Group"
          onChange={(e) => setFilters({
            ...filters,
            bloodGroup: e.target.value
          })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small">
        <InputLabel id="state-label">State</InputLabel>
        <Select
          labelId="state-label"
          id="state"
          value={filters.state}
          label="State"
          onChange={(e) => setFilters({
            ...filters,
            state: e.target.value
          })}
        >
          <MenuItem value="">All</MenuItem>
          {states.map((stateName) => (
            <MenuItem key={stateName} value={stateName}>
              {stateName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl size="small" disabled={!filters.state}>
        <InputLabel id="district-label">District</InputLabel>
        <Select
          labelId="district-label"
          id="district"
          value={filters.district}
          label="District"
          onChange={(e) => setFilters({
            ...filters,
            district: e.target.value
          })}
        >
          <MenuItem value="">All</MenuItem>
          {districts.map((districtName) => (
            <MenuItem key={districtName} value={districtName}>
              {districtName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl size="small" disabled={!filters.district}>
        <InputLabel id="city-label">City</InputLabel>
        <Select
          labelId="city-label"
          id="city"
          value={filters.city}
          label="City"
          onChange={(e) => setFilters({
            ...filters,
            city: e.target.value
          })}
        >
          <MenuItem value="">All</MenuItem>
          {cities.map((cityName) => (
            <MenuItem key={cityName} value={cityName}>
              {cityName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
                onClick={() => downloadRequestsPDF(requests)}
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