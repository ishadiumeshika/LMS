import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>LMS</h1>
        </div>
        <div className="navbar-user">
          <span className="user-info">
            {user.name || user.username} ({user.role})
          </span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
