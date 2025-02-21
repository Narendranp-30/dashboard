import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import '../../styles/DonarForm.scss'; // Ensure this file contains the correct styles
import SideNav from '../dashboard/SideNav';

function ReceiverForm() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('userEmail'), // Add email from localStorage
    name: '',
    age: '',
    contact: '',
    bloodGroup: '',
    state: '',
    district: '',
    city: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please login first');
        return;
      }

      // Include email in the form data
      const receiverData = {
        ...formData,
        email: userEmail
      };

      console.log('Submitting receiver data:', receiverData);
      const response = await axios.post('http://localhost:5000/api/receiver', receiverData);

      console.log('Receiver Form Response:', response.data);
      alert('Receiver form submitted successfully!');

      // Reset the form but keep the email
      setFormData({
        email: userEmail,
        name: '',
        age: '',
        contact: '',
        bloodGroup: '',
        state: '',
        district: '',
        city: '',
        address: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Error submitting form. Please try again.');
    }
  };

  return (
    <div className="blood-request-form-container">
      <SideNav />
      <h1 className="form-title">Receiver Registration Form</h1>
      <form className="blood-request__form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="contact">Contact No:</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form__field">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="district">District:</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <label htmlFor="address">Full Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="form__submit">Submit</button>
      </form>
    </div>
  );
}

export default ReceiverForm;