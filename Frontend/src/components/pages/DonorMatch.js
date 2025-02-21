import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNav2 from '../dashboard/SideNav2';
import '../../styles/DonorMatch.scss';

function DonorMatch() {
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

  return (
    <div className="donor-match-container">
      <SideNav2 />
      <div className="donor-match-content">
        <h2>Your Donor Matches</h2>
        {matches.length === 0 ? (
          <p>No matches found for your blood requests.</p>
        ) : (
          <ul>
            {matches.map((match, index) => (
              <li key={index} className="details-card">
                <h3>Request Details:</h3>
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
}

export default DonorMatch; 