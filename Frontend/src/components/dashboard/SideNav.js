import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/SideNav.scss';
import { FaUserCircle } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi'; // Hamburger icon
import { AiOutlineClose } from 'react-icons/ai'; // Close icon

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userEmail = localStorage.getItem('userEmail') || 'Guest'; // Fallback if userEmail is not available

  return (
    <div>
      {/* Hamburger Menu */}
      <div className="hamburger" onClick={toggleSidebar}>
        {isSidebarOpen ? <AiOutlineClose size={24} /> : <FiMenu size={24} />}
      </div>

      {/* Sidebar */}
      <div className={`sidenav ${isSidebarOpen ? 'sidenav--open' : 'sidenav--closed'}`}>
        <div className="sidenav__header">
          <FaUserCircle className="sidenav__user-icon" />
          <h2 className="sidenav__title">Welcome, {userEmail}</h2>
        </div>
        <ul className="sidenav__menu">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/blood-request">Blood Request</Link>
          </li>
          <li>
            <Link to="/blood-banks">Blood Banks</Link> {/* Added Blood Bank link */}
          </li>
          <li>
            <Link to="/updates">Updates</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
        <div className="sidenav__logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

// Logout handler
const handleLogout = () => {
  localStorage.clear(); // Clear stored user data
  window.location.href = '/login'; // Redirect to login
};

export default SideNav;
