import React, { useState,useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import '../../styles/DonarForm.scss'; // Ensure this file contains the correct styles

function DonorForm() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('userEmail'), // Add email from localStorage
    name: '',
    age: '',
    contact: '',
    bloodGroup: '',
    teetotaler: false,
    height: '',
    weight: '',
    state: '',
    district: '',
    city: '',
    address: '',
    healthDefects: '',
    donationCertificate: null,
  });

  const [errors, setErrors] = useState({
    
  }); // State to handle validation errors
 // ✅ Show eligibility alert on page load
 useEffect(() => {
  alert(
    `Eligibility Criteria:\n\n` +
    `1. You must be above 18 years old to register.\n` +
    `2. Your weight must be above 50 kg to be eligible.\n` +
    `3. If you have consumed any drugs or medicine within the last 24 hours, you are not eligible to donate.`
  );
}, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, donationCertificate: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};

    // Age validation (must be above 18)
    if (formData.age <= 18) {
      newErrors.age = 'You must be above 18 years old to register.';
    }

    // Weight validation (must be above 50 kg)
    if (formData.weight <= 50) {
      newErrors.weight = 'Your weight must be above 50 kg to be eligible.';
    }

    // Teetotaler validation (if not a teetotaler, show a warning)
    if (!formData.teetotaler) {
      newErrors.teetotaler = 'Non-teetotalers are advised to consult a doctor before donating.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    console.log('User email from localStorage:', userEmail);

    if (!userEmail) {
      alert('Please login first');
      return;
    }

    const donorData = new FormData();
    donorData.append('email', userEmail);

    for (const key in formData) {
      if (key !== 'email') {
        donorData.append(key, formData[key]);
      }
    }

    try {
      console.log('Submitting donor data...');
      const response = await axios.post('http://localhost:5000/api/donor', donorData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Server response:', response.data);
      alert('Donor form submitted successfully!');

      setFormData({
        email: userEmail,
        name: '',
        age: '',
        contact: '',
        bloodGroup: '',
        teetotaler: false,
        height: '',
        weight: '',
        state: '',
        district: '',
        city: '',
        address: '',
        healthDefects: '',
        donationCertificate: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error);
      if (error.response?.data?.error === 'Duplicate contact number') {
        alert('This contact number is already registered. Please use a different number or update your existing record.');
      } else {
        alert(error.response?.data?.details || 'Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="blood-request-form-container">
      <h1 className="form-title">Donor Registration Form</h1>
      <form className="blood-request__form" onSubmit={handleSubmit}>
        {/* Name Field */}
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

        {/* Age Field */}
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
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        {/* Contact Field */}
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

        {/* Blood Group Field */}
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

      {/* Teetotaler Field */}
<div className="">
  <label htmlFor="teetotaler" className="checkbox-label">
    <input className='check-doner'
      type="checkbox"
      id="teetotaler"
      name="teetotaler"
      checked={formData.teetotaler}
      onChange={handleChange}
    />
    <span>Are you a teetotaler?</span>
  </label>
  {errors.teetotaler && <p className="error-message">{errors.teetotaler}</p>}
</div>

        {/* Height Field */}
        <div className="form__field">
          <label htmlFor="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        {/* Weight Field */}
        <div className="form__field">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
          {errors.weight && <p className="error-message">{errors.weight}</p>}
        </div>

        {/* State Field */}
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

        {/* District Field */}
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

        {/* City Field */}
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

        {/* Address Field */}
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

        {/* Health Defects Field */}
        <div className="form__field">
          <label htmlFor="healthDefects">Health Defects (if any):</label>
          <textarea
            id="healthDefects"
            name="healthDefects"
            value={formData.healthDefects}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Donation Certificate Field */}
        <div className="form__field">
          <label htmlFor="donationCertificate">Blood Donation Certificate:</label>
          <input
            type="file"
            id="donationCertificate"
            name="donationCertificate"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="form__submit">Submit</button>
      </form>
    </div>
  );
}

export default DonorForm;



// import React, { useState } from 'react';
// import '../../styles/DonarForm.scss'; // Ensure this file contains the correct styles

// function DonorForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     contact: '',
//     bloodGroup: '',
//     teetotaler: false,
//     height: '',
//     weight: '',
//     state: '',
//     district: '',
//     city: '',
//     address: '',
//     healthDefects: '',
//     donationCertificate: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, donationCertificate: e.target.files[0] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Donor Form Data:', formData);
//     alert('Donor form submitted successfully!');
//     setFormData({
//       name: '',
//       age: '',
//       contact: '',
//       bloodGroup: '',
//       teetotaler: false,
//       height: '',
//       weight: '',
//       state: '',
//       district: '',
//       city: '',
//       address: '',
//       healthDefects: '',
//       donationCertificate: null,
//     });
//   };

//   return (
//     <div className="blood-request-form-container">
//       <h1 className="form-title">Donor Registration Form</h1>
//       <form className="blood-request__form" onSubmit={handleSubmit}>
//         <div className="form__field">
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="age">Age:</label>
//           <input
//             type="number"
//             id="age"
//             name="age"
//             value={formData.age}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="contact">Contact No:</label>
//           <input
//             type="tel"
//             id="contact"
//             name="contact"
//             value={formData.contact}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="bloodGroup">Blood Group:</label>
//           <select
//             id="bloodGroup"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled>Select Blood Group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//           </select>
//         </div>

//         <div className="form__field">
//           <label htmlFor="teetotaler">
//             <input
//               type="checkbox"
//               id="teetotaler"
//               name="teetotaler"
//               checked={formData.teetotaler}
//               onChange={handleChange}
//             />
//             Are you a teetotaler?
//           </label>
//         </div>

//         <div className="form__field">
//           <label htmlFor="height">Height (cm):</label>
//           <input
//             type="number"
//             id="height"
//             name="height"
//             value={formData.height}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="weight">Weight (kg):</label>
//           <input
//             type="number"
//             id="weight"
//             name="weight"
//             value={formData.weight}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="state">State:</label>
//           <input
//             type="text"
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="district">District:</label>
//           <input
//             type="text"
//             id="district"
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="city">City:</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form__field">
//           <label htmlFor="address">Full Address:</label>
//           <textarea
//             id="address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="form__field">
//           <label htmlFor="healthDefects">Health Defects (if any):</label>
//           <textarea
//             id="healthDefects"
//             name="healthDefects"
//             value={formData.healthDefects}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         <div className="form__field">
//           <label htmlFor="donationCertificate">Blood Donation Certificate:</label>
//           <input
//             type="file"
//             id="donationCertificate"
//             name="donationCertificate"
//             onChange={handleFileChange}
//           />
//         </div>

//         <button type="submit" className="form__submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default DonorForm;
