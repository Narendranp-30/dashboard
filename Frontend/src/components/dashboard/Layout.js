import React from 'react';
import SideNav from '../dashboard/SideNav';
import '../../styles/Layout.scss'; // Add any layout-specific styles

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <SideNav />
      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
