import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Manage Students</h3>
          <p>Create, view, and manage student records</p>
        </div>
        <div className="dashboard-card">
          <h3>Manage Centers</h3>
          <p>Create and manage learning centers</p>
        </div>
        <div className="dashboard-card">
          <h3>Manage Seminars</h3>
          <p>Create and schedule seminar series</p>
        </div>
        <div className="dashboard-card">
          <h3>View Instructors</h3>
          <p>View all registered instructors</p>
        </div>
        <div className="dashboard-card">
          <h3>View Attendance</h3>
          <p>Access all attendance records</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
