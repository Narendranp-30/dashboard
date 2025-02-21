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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReceiverMatch;