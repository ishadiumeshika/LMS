import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>LMS - Learning Management System</h1>
        {user && (
          <div className="navbar-info">
            <span>Welcome, {user.name}</span>
            <span>Role: {user.role.toUpperCase()}</span>
            {user.instructor_id && <span>ID: {user.instructor_id}</span>}
            {user.student_id && <span>ID: {user.student_id}</span>}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
