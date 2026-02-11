import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../Layout/Layout';
import { useAuth } from '../../../context/AuthContext';
import './CenterDashboard.css';

const CenterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceType, setAttendanceType] = useState('students');

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'instructors') fetchInstructors();
    if (activeTab === 'seminars') fetchSeminars();
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
    setLoading(false);
  };

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

  const markAttendance = async (id, status, type) => {
    try {
      const endpoint = type === 'student' 
        ? 'http://localhost:5000/api/attendance/students'
        : 'http://localhost:5000/api/attendance/instructors';
      
      const data = type === 'student'
        ? { date: selectedDate, studentId: id, centerId: user.profile._id, status }
        : { date: selectedDate, instructorId: id, centerId: user.profile._id, status };

      await axios.post(endpoint, data);
      alert('Attendance marked successfully!');
    } catch (error) {
      alert('Error marking attendance: ' + error.response?.data?.message);
    }
  };

  const assignInstructor = async (instructorId) => {
    try {
      await axios.put(`http://localhost:5000/api/instructors/${instructorId}/assign-center`, {
        centerId: user.profile._id
      });
      alert('Instructor assigned to center successfully!');
      fetchInstructors();
    } catch (error) {
      alert('Error assigning instructor: ' + error.response?.data?.message);
    }
  };

  return (
    <Layout>
      <div className="center-dashboard">
        <h2>Center Dashboard</h2>
        <div className="center-info">
          <p><strong>Center:</strong> {user?.profile?.centerName}</p>
          <p><strong>Location:</strong> {user?.profile?.city}, {user?.profile?.town}</p>
        </div>

        <div className="tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
            Students
          </button>
          <button className={activeTab === 'instructors' ? 'active' : ''} onClick={() => setActiveTab('instructors')}>
            Instructors
          </button>
          <button className={activeTab === 'seminars' ? 'active' : ''} onClick={() => setActiveTab('seminars')}>
            Seminars
          </button>
          <button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
            Mark Attendance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h3>Center Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Students</h4>
                  <p className="stat-number">{students.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Instructors</h4>
                  <p className="stat-number">{instructors.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Upcoming Seminars</h4>
                  <p className="stat-number">{seminars.filter(s => s.status === 'scheduled').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-section">
              <h3>Students at {user?.profile?.centerName}</h3>
              {loading ? <p>Loading...</p> : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Age/Grade</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id}>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.ageOrGrade}</td>
                        <td>{student.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'instructors' && (
            <div className="instructors-section">
              <h3>Instructors</h3>
              {loading ? <p>Loading...</p> : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>University ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Center</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map(instructor => (
                      <tr key={instructor._id}>
                        <td>{instructor.universityId}</td>
                        <td>{instructor.name}</td>
                        <td>{instructor.email}</td>
                        <td>{instructor.centerId?.centerName || 'Not Assigned'}</td>
                        <td>
                          {!instructor.centerId && (
                            <button className="btn-assign" onClick={() => assignInstructor(instructor._id)}>
                              Assign to My Center
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

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
                        <p><strong>Status:</strong> {seminar.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-section">
              <h3>Mark Attendance</h3>
              
              <div className="attendance-controls">
                <div className="form-group">
                  <label>Date:</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Type:</label>
                  <select value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
                    <option value="students">Students</option>
                    <option value="instructors">Instructors</option>
                  </select>
                </div>
              </div>

              {attendanceType === 'students' ? (
                <div>
                  <h4>Mark Student Attendance</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td>{student.studentId}</td>
                          <td>{student.name}</td>
                          <td>
                            <button className="btn-present" onClick={() => markAttendance(student._id, 'present', 'student')}>Present</button>
                            <button className="btn-absent" onClick={() => markAttendance(student._id, 'absent', 'student')}>Absent</button>
                            <button className="btn-late" onClick={() => markAttendance(student._id, 'late', 'student')}>Late</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <h4>Mark Instructor Attendance</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>University ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors.map(instructor => (
                        <tr key={instructor._id}>
                          <td>{instructor.universityId}</td>
                          <td>{instructor.name}</td>
                          <td>
                            <button className="btn-present" onClick={() => markAttendance(instructor._id, 'present', 'instructor')}>Present</button>
                            <button className="btn-absent" onClick={() => markAttendance(instructor._id, 'absent', 'instructor')}>Absent</button>
                            <button className="btn-late" onClick={() => markAttendance(instructor._id, 'late', 'instructor')}>Late</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CenterDashboard;
