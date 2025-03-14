import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../dashboard/SideNav';
import { FaHistory, FaExchangeAlt, FaArrowRight, FaClock } from 'react-icons/fa';
import '../../styles/History.scss';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Get user email and type from localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  useEffect(() => {
    // Check if user is logged in
    if (!userEmail) {
      navigate('/login');
      return;
    }

    // Determine user type
    const isDonor = localStorage.getItem('isDonor') === 'true';
    const isReceiver = localStorage.getItem('isReceiver') === 'true';
    
    if (isDonor) {
      setUserType('donor');
    } else if (isReceiver) {
      setUserType('receiver');
    }

    // Fetch user history
    fetchUserHistory();
  }, [navigate, userEmail]);

  const fetchUserHistory = async () => {
    setLoading(true);
    try {
      // Use the appropriate endpoint based on user type
      const response = await axios.get(`http://localhost:5000/api/history/${userEmail}`);
      
      if (response.data) {
        setHistory(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history. Please try again later.');
      setLoading(false);
    }
  };

  const filterHistory = (items) => {
    if (activeTab === 'all') {
      return items;
    }
    return items.filter(item => item.status.toLowerCase() === activeTab);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
      case 'denied':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return 'Invalid date';
      
      // Format options for more readable date
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="history-page">
      <SideNav />
      <div className="history-content">
        <div className="history-header">
          <h1><FaHistory /> My History</h1>
          <p>View your past blood donation requests and activities</p>
        </div>

        <div className="tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={activeTab === 'pending' ? 'active' : ''} 
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={activeTab === 'accepted' ? 'active' : ''} 
            onClick={() => setActiveTab('accepted')}
          >
            Accepted
          </button>
          <button 
            className={activeTab === 'rejected' ? 'active' : ''} 
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading your history...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <FaClock size={48} />
            <h2>No History Yet</h2>
            <p>You haven't made any blood donation requests or activities yet.</p>
            {userType === 'donor' ? (
              <button onClick={() => navigate('/blood-request')}>Make a donation</button>
            ) : (
              <button onClick={() => navigate('/blood-request')}>Request blood</button>
            )}
          </div>
        ) : (
          <div className="history-list">
            {filterHistory(history).map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-item-header">
                  <div className="history-item-type">
                    <FaExchangeAlt />
                    <span>{item.type || 'Blood Request'}</span>
                  </div>
                  <div className={`history-item-status ${getStatusClass(item.status)}`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="history-item-details">
                  <div className="request-direction">
                    <div className="from">
                      <p><strong>From:</strong></p>
                      <p>{item.senderEmail || userEmail}</p>
                    </div>
                    <div className="arrow">
                      <FaArrowRight />
                    </div>
                    <div className="to">
                      <p><strong>To:</strong></p>
                      <p>{item.receiverEmail || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {item.bloodGroup && (
                    <p><strong>Blood Group:</strong> {item.bloodGroup}</p>
                  )}
                  
                  {item.message && (
                    <div className="message">
                      <strong>Message:</strong>
                      <p>{item.message}</p>
                    </div>
                  )}
                  
                  <div className="date">
                    <p><strong>Date:</strong> {formatDate(item.createdAt)}</p>
                    {item.updatedAt && item.updatedAt !== item.createdAt && (
                      <p><strong>Last Updated:</strong> {formatDate(item.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
