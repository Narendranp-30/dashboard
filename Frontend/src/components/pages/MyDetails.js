import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideNav2 from '../dashboard/SideNav2';
import '../../styles/MyDetails.scss';

function MyDetails() {
  const [donorDetails, setDonorDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchDonorDetails();
  }, []);

  const fetchDonorDetails = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log('Attempting to fetch details for email:', userEmail); // Debug log

      if (!userEmail) {
        console.log('No email found in localStorage');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/donor/details?email=${userEmail}`);
      console.log('API Response:', response); // Log full response
      console.log('Donor data received:', response.data); // Log just the data

      if (response.data.length === 0) {
        console.log('No donor records found for this email');
      }

      setDonorDetails(response.data);
      setFormData(response.data[0] || {});
    } catch (error) {
      console.error('Error fetching donor details:', error.response?.data || error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleSave = async () => {
    try {
      const { contact, ...updateData } = formData; // Exclude _id from update data
      console.log('Updating donor with data:', updateData); // Debug log

      const response = await axios.put(
        `http://localhost:5000/api/donor/${contact}`,
        updateData
      );
      setDonorDetails([response.data]); // Update donor details with the response
      setIsEditing(false); // Disable edit mode
      alert('Donor details updated successfully!');
    } catch (error) {
      console.error('Error updating donor details:', error);
      alert('Failed to update donor details.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        const { contact } = donorDetails[0];
        await axios.delete(`http://localhost:5000/api/donor/${contact}`);
        setDonorDetails(null); // Clear donor details
        alert('Donor deleted successfully!');
      } catch (error) {
        console.error('Error deleting donor details:', error);
        alert('Failed to delete donor details.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <SideNav2 />
      <div className="my-details-container">
        <h2>My Details</h2>
        {donorDetails ? (
          donorDetails.length > 0 ? (
            <div className="details-card">
              {isEditing ? (
                // Edit Form
                <div>
                  <p>
                    <strong>Name:</strong>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Age:</strong>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Blood Group:</strong>
                    <input
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Contact:</strong>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Teetotaler:</strong>
                    <select
                      name="teetotaler"
                      value={formData.teetotaler ? 'Yes' : 'No'}
                      onChange={(e) =>
                        setFormData({ ...formData, teetotaler: e.target.value === 'Yes' })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </p>
                  <p>
                    <strong>Height:</strong>
                    <input
                      type="number"
                      name="height"
                      value={formData.height || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Weight:</strong>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>State:</strong>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>District:</strong>
                    <input
                      type="text"
                      name="district"
                      value={formData.district || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>City:</strong>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Address:</strong>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Health Defects:</strong>
                    <input
                      type="text"
                      name="healthDefects"
                      value={formData.healthDefects || ''}
                      onChange={handleChange}
                    />
                  </p>
                  <div className="button-container">
                    <button onClick={handleSave} className="save-button">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                  </div>
                </div>
              ) : (
                // Display Details
                <div>
                  <p><strong>Name:</strong> {donorDetails[0].name}</p>
                  <p><strong>Age:</strong> {donorDetails[0].age}</p>
                  <p><strong>Blood Group:</strong> {donorDetails[0].bloodGroup}</p>
                  <p><strong>Contact:</strong> {donorDetails[0].contact}</p>
                  <p><strong>Teetotaler:</strong> {donorDetails[0].teetotaler ? 'Yes' : 'No'}</p>
                  <p><strong>Height:</strong> {donorDetails[0].height} cm</p>
                  <p><strong>Weight:</strong> {donorDetails[0].weight} kg</p>
                  <p><strong>State:</strong> {donorDetails[0].state}</p>
                  <p><strong>District:</strong> {donorDetails[0].district}</p>
                  <p><strong>City:</strong> {donorDetails[0].city}</p>
                  <p><strong>Address:</strong> {donorDetails[0].address}</p>
                  <p><strong>Health Defects:</strong> {donorDetails[0].healthDefects || 'N/A'}</p>
                  {donorDetails[0].donationCertificate && (
                    <p>
                      <strong>Donation Certificate:</strong>{' '}
                      <a href={`http://localhost:5000/${donorDetails[0].donationCertificate}`} target="_blank" rel="noopener noreferrer">
                        View Certificate
                      </a>
                    </p>
                  )}
                  <div className="button-container">
                    <button onClick={handleEdit} className="edit-button">Edit</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No donor details available.</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default MyDetails;