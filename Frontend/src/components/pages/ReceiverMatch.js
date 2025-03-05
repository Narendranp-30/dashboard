import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNav2 from '../dashboard/SideNav2';
import '../../styles/ReceiverMatch.scss';

function ReceiverMatch() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        if (!userEmail) {
          console.log('No user email found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/received-requests?email=${userEmail}`);
        console.log('Received requests:', response.data);
        setReceivedRequests(response.data);
      } catch (error) {
        console.error('Error fetching received requests:', error);
      }
    };

    fetchReceivedRequests();
  }, [userEmail]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/received-requests/${requestId}`, {
        status: 'accepted'
      });
      setReceivedRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, status: 'accepted' } : request
        )
      );
      alert('Request accepted successfully!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleDeny = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/received-requests/${requestId}`, {
        status: 'denied'
      });
      setReceivedRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, status: 'denied' } : request
        )
      );
      alert('Request denied successfully!');
    } catch (error) {
      console.error('Error denying request:', error);
      alert('Failed to deny request. Please try again.');
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/received-requests/${requestId}`);
      // Remove the request from local state
      setReceivedRequests(prevRequests =>
        prevRequests.filter(request => request._id !== requestId)
      );
      alert('Request deleted successfully!');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request. Please try again.');
    }
  };

  return (
    <div className="receiver-match-container">
      <SideNav2 />
      <div className="receiver-match-content">
        <h2>Received Requests</h2>
        {receivedRequests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <ul>
            {receivedRequests.map((request, index) => (
              <li key={index} className="details-card">
                <h3>Request Details:</h3>
                <p><strong>Sender Email:</strong> {request.senderEmail}</p>
                <p><strong>Message:</strong> {request.message}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <div className="button-container">
                  {request.status === 'pending' && (
                    <>
                      <button
                        className="accept-button"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept Request
                      </button>
                      <button
                        className="deny-button"
                        onClick={() => handleDeny(request._id)}
                      >
                        Deny Request
                      </button>
                    </>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete Request
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReceiverMatch;