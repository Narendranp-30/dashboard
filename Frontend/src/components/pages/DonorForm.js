import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import '../../styles/DonarForm.scss'; // Ensure this file contains the correct styles

function DonorForm() {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to be sent to the backend
    const donorData = new FormData();
    for (const key in formData) {
      donorData.append(key, formData[key]);
    }

    try {
      // Send the form data to the backend using Axios
      const response = await axios.post('http://localhost:5000/api/donor-details', donorData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Donor Form Data:', response.data);
      alert('Donor form submitted successfully!');
      
      // Reset the form
      setFormData({
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
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="blood-request-form-container">
      <h1 className="form-title">Donor Registration Form</h1>
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
          <label htmlFor="teetotaler">
            <input
              type="checkbox"
              id="teetotaler"
              name="teetotaler"
              checked={formData.teetotaler}
              onChange={handleChange}
            />
            Are you a teetotaler?
          </label>
        </div>

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

        <div className="form__field">
          <label htmlFor="healthDefects">Health Defects (if any):</label>
          <textarea
            id="healthDefects"
            name="healthDefects"
            value={formData.healthDefects}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form__field">
          <label htmlFor="donationCertificate">Blood Donation Certificate:</label>
          <input
            type="file"
            id="donationCertificate"
            name="donationCertificate"
            onChange={handleFileChange}
          />
        </div>

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
