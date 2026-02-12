import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { seminarsAPI, attendanceAPI, centersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [seminars, setSeminars] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seminarsRes, attendanceRes, centersRes] = await Promise.all([
        seminarsAPI.getAll(),
        attendanceAPI.getMyAttendance(),
        centersAPI.getAll()
      ]);

      setSeminars(seminarsRes.data);
      setMyAttendance(attendanceRes.data);
      setCenters(centersRes.data);
      setError('');
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (myAttendance.length === 0) return 0;
    const presentCount = myAttendance.filter(record => record.status === 'present').length;
    return ((presentCount / myAttendance.length) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <div className="dashboard-header">
          <h2>Student Dashboard</h2>
          <p>Welcome, {user.name} ({user.student_id})</p>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Seminars</h3>
            <div className="count">{seminars.length}</div>
          </div>
          <div className="card">
            <h3>My Attendance Records</h3>
            <div className="count">{myAttendance.length}</div>
          </div>
          <div className="card">
            <h3>Attendance Rate</h3>
            <div className="count">{calculateAttendanceRate()}%</div>
          </div>
          <div className="card">
            <h3>My Center</h3>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              {user.center?.center_name || 'Not Assigned'}
            </div>
          </div>
        </div>

        <div className="section">
          <h3>All Seminars</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Center</th>
                <th>Instructor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {seminars.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No seminars available</td>
                </tr>
              ) : (
                seminars.map(seminar => (
                  <tr key={seminar._id}>
                    <td>{seminar.title}</td>
                    <td>{seminar.description || 'N/A'}</td>
                    <td>{new Date(seminar.date).toLocaleDateString()}</td>
                    <td>{seminar.center?.center_name}</td>
                    <td>{seminar.instructor?.name || 'Not Assigned'}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: seminar.status === 'completed' ? '#28a745' : '#667eea',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {seminar.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h3>My Attendance History</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Center</th>
                <th>Seminar</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              ) : (
                myAttendance.map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.center?.center_name}</td>
                    <td>{record.seminar?.title || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: record.status === 'present' ? '#28a745' : 
                                   record.status === 'late' ? '#ffc107' : '#dc3545',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h3>Available Centers</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Center ID</th>
                <th>Center Name</th>
                <th>Town</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {centers.map(center => (
                <tr key={center._id}>
                  <td>{center.center_id}</td>
                  <td>{center.center_name}</td>
                  <td>{center.town}</td>
                  <td>{center.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
