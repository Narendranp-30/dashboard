import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ReceiverDashboard from './components/dashboard/ReceiverDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import Home from './components/pages/Home';
import BloodRequest from './components/pages/BloodRequest';
import SideNav from './components/dashboard/SideNav';
import MyDetails from './components/pages/MyDetails';
import Updates from './components/pages/updates';
import BloodBank from './components/pages/BloodBank';
import ReceiverMatch from './components/pages/ReceiverMatch';
import Admin from './components/auth/Admin';
import AdminDashboard from './components/admin/AdminDashboard';

import { AuthProvider } from './components/Context/AuthContext';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <div className="app__content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/receiver-dashboard" element={<ReceiverDashboard />} />
              <Route path="/donor-dashboard" element={<DonorDashboard />} />
              <Route path="/blood-request" element={<BloodRequest />} />
              <Route path="/my-details" element={<MyDetails />} />
              <Route path="/updates" element={<Updates />} />
              <Route path="/receiver-match" element={<ReceiverMatch />} />
              <Route path="/blood-banks" element={<BloodBank />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// import React from "react";

// function App() {
//     return (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//             <h1>Power BI Embedded Demo</h1>
//             <iframe
//                 title="DEMO"
//                 width="1500"
//                 height="700"
//                 src="https://app.powerbi.com/view?r=eyJrIjoiYzRkZDBlYTEtM2YzMC00ZGU2LTg5MGMtY2MyNmMwODUzYzFhIiwidCI6ImE0N2RmZDAxLThhZDktNGRlYi1hNTcxLTM0Mzk0N2FhNjZmMiJ9"
//                 frameBorder="0"
//                 allowFullScreen={true}
//             ></iframe>
//         </div>
//     );
// }
// export default App;
