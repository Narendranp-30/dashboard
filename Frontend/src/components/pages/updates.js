import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/updates.scss';
import SideNav from '../dashboard/SideNav';

const Updates = () => {
  const [matches, setMatches] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!userEmail) {
          console.log('No user email found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/matching?email=${userEmail}`);
        console.log('Matches received:', response.data);
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [userEmail]);

  // Function to handle the "Send Request" button click
  const handleSendRequest = async (donor, match) => {
    if (donor.bloodGroup !== match.receiver.bloodGroup || donor.district !== match.receiver.district) {
      alert('This donor does not perfectly match your request criteria.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/send-request', {
        senderEmail: userEmail,
        receiverEmail: donor.email,
        message: `Request for blood group ${donor.bloodGroup}`,
      });

      console.log('Request sent successfully:', response.data);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  return (
    <div>
      <SideNav />
      <div className="updates-container">
        <h2>Your Blood Request Matches</h2>
        {matches.length === 0 ? (
          <p>No matches found for your blood requests.</p>
        ) : (
          <ul>
            {matches.map((match, index) => (
              <li key={index} className="details-card">
                <h3>Your Request Details:</h3>
                <p>Blood Group: {match.receiver.bloodGroup}</p>
                <p>Location: {match.receiver.district}, {match.receiver.city}</p>
                
                <h4>Matching Donors ({match.matchedDonors.length}):</h4>
                {match.matchedDonors.length > 0 ? (
                  <ul className="matched-donors">
                    {match.matchedDonors.map((donor, idx) => (
                      <li key={idx}>
                        <p><strong>Name:</strong> {donor.name}</p>
                        <p><strong>Contact:</strong> {donor.contact}</p>
                        <p><strong>Location:</strong> {donor.district}, {donor.city}</p>
                        <button
                          className="send-request-button"
                          onClick={() => handleSendRequest(donor, match)}
                        >
                          Send Request
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No matching donors found in your area.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Updates; 