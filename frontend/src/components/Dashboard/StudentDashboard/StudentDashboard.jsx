import React from 'react';

const StudentDashboard = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>View Seminars</h3>
          <p>See all scheduled seminars</p>
        </div>
        <div className="dashboard-card">
          <h3>Track Attendance</h3>
          <p>View your personal attendance records</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
