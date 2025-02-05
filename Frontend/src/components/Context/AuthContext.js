import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const AuthContext = createContext();

// AuthProvider component to provide auth context to other components
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  // Check for user role in localStorage on component mount
  useEffect(() => {
    const savedUserRole = localStorage.getItem('userRole');
    if (savedUserRole) {
      setUserRole(savedUserRole);
    }
  }, []);

  // Handle login
  const login = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role); // Save role in localStorage
  };

  // Handle logout
  const logout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole'); // Clear role from localStorage
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
