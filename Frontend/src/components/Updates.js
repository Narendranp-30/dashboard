import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Updates({ request, setRequest }) {
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for testing

  // Initialize the timer when the component mounts or when request changes
  useEffect(() => {
    if (request && request.status === 'pending') {
      // Clear any existing timer first
      if (timer) clearTimeout(timer);
      
      // Start the countdown
      const startTime = Date.now();
      const newTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = 60 - elapsed;
        
        if (remaining <= 0) {
          clearInterval(newTimer);
          sendSOSAlert();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      
      setTimer(newTimer);
    }
    
    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [request]); // Add request as a dependency

  const sendSOSAlert = async () => {
    try {
      const response = await axios.post('/api/sos', {
        requestId: request._id,
        donorId: request.donorId,
        requesterId: request.requesterId
      });
      
      if (response.data.success) {
        console.log('SOS alert sent successfully');
        // Update UI to show alert was sent
      } else {
        console.error('Failed to send SOS alert:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error);
    }
  };

  return (
    // ... existing code ...
  );
}

export default Updates; 