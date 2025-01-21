// BloodRequest.jsx
import React, { useState } from 'react';
import SideNav from '../dashboard/SideNav';
import '../../styles/BloodRequest.scss';

function BloodRequest() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState(1);
  const [hospital, setHospital] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct request data
    const requestData = {
      bloodGroup,
      units,
      hospital,
      contactInfo,
    };

    console.log('Blood Request Data:', requestData);
    setMessage('Your blood request has been submitted successfully!');

    // Reset form fields
    setBloodGroup('');
    setUnits(1);
    setHospital('');
    setContactInfo('');
  };

  return (
    <div className="blood-request">
      <SideNav />

      <div className="blood-request__content">
        <h1>Blood Request</h1>
        <p>Fill in the form below to request blood:</p>

        <form className="blood-request__form" onSubmit={handleSubmit}>
          <div className="form__field">
            <label htmlFor="bloodGroup">Blood Group:</label>
            <select
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
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
            <label htmlFor="units">Units Required:</label>
            <input
              type="number"
              id="units"
              min="1"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="hospital">Hospital Name:</label>
            <input
              type="text"
              id="hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="contactInfo">Contact Information:</label>
            <input
              type="text"
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form__submit">Submit Request</button>
        </form>

        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
}

export default BloodRequest;
