import React from 'react';

const CenterDashboard = () => {
  return (
    <div>
      <h2>Center Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>View Students</h3>
          <p>See students enrolled at your center</p>
        </div>
        <div className="dashboard-card">
          <h3>View Instructors</h3>
          <p>See all instructors</p>
        </div>
        <div className="dashboard-card">
          <h3>Assign Instructors</h3>
          <p>Assign instructors to your center</p>
        </div>
        <div className="dashboard-card">
          <h3>Mark Attendance</h3>
          <p>Mark daily attendance for students and instructors</p>
        </div>
        <div className="dashboard-card">
          <h3>View Seminars</h3>
          <p>Access seminar series information</p>
        </div>
      </div>
    </div>
  );
};

export default CenterDashboard;
