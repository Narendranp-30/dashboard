import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/updates.scss';
import SideNav from '../dashboard/SideNav';

const Updates = () => {
  const [matches, setMatches] = useState([]);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [requestTimes, setRequestTimes] = useState({});
  const userEmail = localStorage.getItem('userEmail');
  const [sentRequests, setSentRequests] = useState(new Set());
  const [sosTimers, setSosTimers] = useState({});
  // In Updates.js, change 10 minutes to 1 minute for testing
const SOS_DELAY = 1 * 60 * 1000; // 1 minute
  const audioRef = useRef(new Audio('/sos-alert.mp3'));

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - requestTime) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

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

        const statusResponse = await axios.get(`http://localhost:5000/api/sent-requests?senderEmail=${userEmail}`);
        const statusMap = {};
        const timeMap = {};
        statusResponse.data.forEach(request => {
          statusMap[request.receiverEmail] = request.status;
          timeMap[request.receiverEmail] = request.createdAt;
        });
        setRequestStatuses(statusMap);
        setRequestTimes(timeMap);
        
        setSentRequests(new Set(Object.keys(statusMap)));
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();

    const interval = setInterval(() => {
      setRequestTimes(prevTimes => ({ ...prevTimes }));
    }, 1000);

    return () => clearInterval(interval);
  }, [userEmail]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted':
        return '#4CAF50';
      case 'denied':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'accepted':
        return 'Request Accepted';
      case 'denied':
        return 'Request Denied';
      case 'pending':
        return 'Request Pending';
      default:
        return 'Send Request';
    }
  };

  // Function to play SOS alert
  const playSOSAlert = () => {
    audioRef.current.loop = true;
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  // Function to stop SOS alert
  const stopSOSAlert = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleSendRequest = async (donor, match) => {
    if (donor.bloodGroup !== match.receiver.bloodGroup || donor.district !== match.receiver.district) {
      alert('This donor does not perfectly match your request criteria.');
      return;
    }

    try {
      const requestData = {
        senderEmail: userEmail,
        receiverEmail: donor.email,
        message: `Blood Request for ${donor.bloodGroup} in ${donor.district}`,
      };

      console.log('Sending request with data:', requestData);

      const response = await axios.post('http://localhost:5000/api/send-request', requestData);
      console.log('Request sent, starting timer...');

      // Set timer for SOS alert (1 minute for testing)
      const currentTime = new Date();
      setRequestTimes(prev => ({
        ...prev,
        [donor.email]: currentTime.toISOString()
      }));

      // Create and store the timer
      const timerId = setTimeout(async () => {
        console.log('Timer triggered for donor:', donor.email);
        try {
          const sosResponse = await axios.post('http://localhost:5000/api/sos', {
            donor: {
              name: donor.name,
              contact: donor.contact,
              email: donor.email
            },
            requester: {
              name: match.receiver.name,
              bloodGroup: match.receiver.bloodGroup,
              district: match.receiver.district,
              contact: match.receiver.contact
            }
          });
          console.log('SOS alert sent:', sosResponse.data);
          alert('SOS Alert sent due to no response!');
        } catch (error) {
          console.error('Error sending SOS:', error);
        }
      }, 60000); // 1 minute (60000 ms) for testing

      // Store the timer ID
      setSosTimers(prev => ({
        ...prev,
        [donor.email]: timerId
      }));

      setSentRequests(prev => new Set(prev).add(donor.email));
      alert('Request sent successfully! SOS alert will trigger in 1 minute if no response.');

    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      // Clear all timers when component unmounts
      Object.values(sosTimers).forEach(timerId => {
        clearTimeout(timerId);
      });
    };
  }, [sosTimers]);

  // Update the render method to show countdown
  const getTimeRemaining = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - requestTime) / 1000);
    const remainingSeconds = 60 - diffInSeconds; // 1 minute = 60 seconds

    if (remainingSeconds <= 0) return 'SOS Alert Sent';
    return `SOS Alert in: ${remainingSeconds} seconds`;
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
                        <div className="request-status">
                          <button
                            className={`send-request-button ${requestStatuses[donor.email] || ''}`}
                            onClick={() => handleSendRequest(donor, match)}
                            disabled={sentRequests.has(donor.email)}
                            style={{
                              backgroundColor: getStatusColor(requestStatuses[donor.email])
                            }}
                          >
                            {getStatusText(requestStatuses[donor.email])}
                          </button>
                          {requestTimes[donor.email] && (
                            <p className="timer-text">
                              {getTimeRemaining(requestTimes[donor.email])}
                            </p>
                          )}
                        </div>
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