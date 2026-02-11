import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../Layout/Layout';
import { useAuth } from '../../../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('seminars');
  const [seminars, setSeminars] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'seminars') fetchSeminars();
    if (activeTab === 'attendance') fetchMyAttendance();
  }, [activeTab]);

  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/seminars');
      setSeminars(response.data);
    } catch (error) {
      console.error('Error fetching seminars:', error);
    }
    setLoading(false);
  };

  const fetchMyAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/attendance/students');
      setAttendance(response.data);
      console.log('Attendance data:', response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="student-dashboard">
        <h2>Student Dashboard</h2>
        <div className="student-info">
          <p><strong>Name:</strong> {user?.profile?.name}</p>
          <p><strong>Student ID:</strong> {user?.profile?.studentId}</p>
          <p><strong>Age/Grade:</strong> {user?.profile?.ageOrGrade}</p>
          <p><strong>Gender:</strong> {user?.profile?.gender}</p>
          <p><strong>Center:</strong> {user?.profile?.centerId?.centerName || 'N/A'}</p>
        </div>

        <div className="tabs">
          <button className={activeTab === 'seminars' ? 'active' : ''} onClick={() => setActiveTab('seminars')}>
            View Seminars
          </button>
          <button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
            My Attendance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'seminars' && (
            <div className="seminars-section">
              <h3>Seminar Series</h3>
              {loading ? <p>Loading...</p> : (
                <div className="seminars-grid">
                  {seminars.map(seminar => (
                    <div key={seminar._id} className="seminar-card">
                      <h4>{seminar.title}</h4>
                      <p>{seminar.description}</p>
                      <div className="seminar-details">
                        <p><strong>Date:</strong> {new Date(seminar.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {seminar.time}</p>
                        <p><strong>Venue:</strong> {seminar.venue}</p>
                        <p><strong>Status:</strong> <span className={'status-' + seminar.status}>{seminar.status}</span></p>
                        {seminar.instructorId && (
                          <p><strong>Instructor:</strong> {seminar.instructorId.name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-section">
              <h3>My Attendance Records</h3>
              {loading ? <p>Loading...</p> : (
                <>
                  {attendance.length === 0 ? (
                    <p>No attendance records found.</p>
                  ) : (
                    <>
                      <div className="attendance-summary">
                        <div className="summary-card">
                          <h4>Total Records</h4>
                          <p className="summary-number">{attendance.length}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Present</h4>
                          <p className="summary-number">{attendance.filter(a => a.status === 'present').length}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Absent</h4>
                          <p className="summary-number">{attendance.filter(a => a.status === 'absent').length}</p>
                        </div>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Center</th>
                            <th>Status</th>
                            <th>Marked By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map(record => (
                            <tr key={record._id}>
                              <td>{new Date(record.date).toLocaleDateString()}</td>
                              <td>{record.centerId?.centerName || 'N/A'}</td>
                              <td>
                                <span className={'status-badge status-' + record.status}>
                                  {record.status}
                                </span>
                              </td>
                              <td>{record.markedBy?.username || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
