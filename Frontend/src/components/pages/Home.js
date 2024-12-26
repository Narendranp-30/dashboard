import React, { useState } from 'react';
import SideNav from '../dashboard/SideNav';
import '../../styles/Home.scss';

function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);  // State to control sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="home">
      <div className="home__hamburger" onClick={toggleSidebar}>
        <div className="hamburger__icon"></div>
        <div className="hamburger__icon"></div>
        <div className="hamburger__icon"></div>
      </div>
      
      {isSidebarVisible && <SideNav />}
      
      <div className="home__content">
       

        <div className="home__iframe-container">
          <iframe 
            className="home__iframe"
            title="Visual blood"
            src="https://app.powerbi.com/view?r=eyJrIjoiMjA5NGJlZTktMWJlMC00NWM3LTg5ZmQtNzdiYzkwOTFjZWYxIiwidCI6ImE0N2RmZDAxLThhZDktNGRlYi1hNTcxLTM0Mzk0N2FhNjZmMiJ9" 
            allowFullScreen="true">
          </iframe>
        </div>
      </div>
    </div>
  );
}

export default Home;
