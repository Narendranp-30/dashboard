import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import '../../styles/UserHistory.scss';

function UserHistory() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user details
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
        setUser(userResponse.data);

        // Fetch user's donation history if they are a donor
        if (userResponse.data.userType === 'donor') {
          const donationsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/donations/user/${userId}`);
          setDonations(donationsResponse.data);
        }

        // Fetch user's request history
        const requestsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/user/${userId}`);
        setRequests(requestsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user history:', err);
        setError('Failed to load user history. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const downloadHistoryPDF = () => {
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
      
      // Add user information
      if (user) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`${user.name}'s History`, margin, yPos);
        yPos += lineHeight * 2;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`User Type: ${user.userType === 'donor' ? 'Donor' : 'Receiver'}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`Email: ${user.email}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`Blood Group: ${user.bloodGroup}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`Location: ${user.city}, ${user.district}, ${user.state}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`Contact: ${user.phone}`, margin, yPos);
        yPos += lineHeight * 2;
      }
      
      // Add donation history if user is a donor
      if (user?.userType === 'donor' && donations.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Donation History', margin, yPos);
        yPos += lineHeight * 1.5;
        
        // Create donation table
        const donationHeaders = [['Date', 'Recipient', 'Status', 'Notes']];
        const donationData = donations.map(donation => [
          new Date(donation.date).toLocaleDateString(),
          donation.recipientName || 'N/A',
          donation.status,
          donation.notes || 'N/A'
        ]);
        
        doc.autoTable({
          startY: yPos,
          head: donationHeaders,
          body: donationData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
          margin: { left: margin }
        });
        
        yPos = doc.lastAutoTable.finalY + lineHeight * 2;
      }
      
      // Add request history
      if (requests.length > 0) {
        // Check if we need a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Request History', margin, yPos);
        yPos += lineHeight * 1.5;
        
        // Create request table
        const requestHeaders = [['Date', 'Status', 'From/To', 'Message']];
        const requestData = requests.map(request => {
          const counterparty = user?.userType === 'donor' 
            ? request.receiverEmail 
            : request.senderEmail;
          
          const direction = user?.userType === 'donor' ? 'To' : 'From';
          
          return [
            new Date(request.createdAt).toLocaleDateString(),
            request.status,
            `${direction}: ${counterparty}`,
            request.message || 'N/A'
          ];
        });
        
        doc.autoTable({
          startY: yPos,
          head: requestHeaders,
          body: requestData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
          margin: { left: margin },
          columnStyles: {
            3: { cellWidth: 60 } // Make message column wider
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
      doc.save(`${user?.name || 'User'}-history.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const goBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="user-history loading">
        <div className="spinner"></div>
        <p>Loading user history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-history error">
        <p>{error}</p>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="user-history">
      <div className="history-header">
        <button onClick={goBack} className="back-button">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>{user?.name}'s History</h1>
        <button onClick={downloadHistoryPDF} className="download-button">
          <FaDownload /> Download History
        </button>
      </div>

      <div className="user-details">
        <h2>User Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">User Type:</span>
            <span className="value">{user?.userType === 'donor' ? 'Donor' : 'Receiver'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{user?.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Blood Group:</span>
            <span className="value">{user?.bloodGroup}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span className="value">{user?.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Location:</span>
            <span className="value">{user?.city}, {user?.district}, {user?.state}</span>
          </div>
        </div>
      </div>

      {user?.userType === 'donor' && (
        <div className="history-section">
          <h2>Donation History</h2>
          {donations.length === 0 ? (
            <p className="no-data">No donation records found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, index) => (
                    <tr key={index}>
                      <td>{new Date(donation.date).toLocaleDateString()}</td>
                      <td>{donation.recipientName || 'N/A'}</td>
                      <td>
                        <span className={`status ${donation.status.toLowerCase()}`}>
                          {donation.status}
                        </span>
                      </td>
                      <td>{donation.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="history-section">
        <h2>Request History</h2>
        {requests.length === 0 ? (
          <p className="no-data">No request records found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>{user?.userType === 'donor' ? 'To' : 'From'}</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {user?.userType === 'donor' 
                        ? request.receiverEmail 
                        : request.senderEmail}
                    </td>
                    <td>{request.message || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHistory;
