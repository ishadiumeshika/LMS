import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { 
  usersAPI, 
  centersAPI, 
  seminarsAPI, 
  attendanceAPI 
} from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    centers: 0,
    seminars: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    students: [],
    instructors: [],
    centers: [],
    seminars: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [showSeminarModal, setShowSeminarModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Form states
  const [centerForm, setCenterForm] = useState({
    center_id: '',
    center_name: '',
    town: '',
    city: ''
  });

  const [seminarForm, setSeminarForm] = useState({
    title: '',
    description: '',
    date: '',
    center: '',
    instructor: '',
    status: 'scheduled'
  });

  const [attendanceForm, setAttendanceForm] = useState({
    date: '',
    student_id: '',
    instructor_id: '',
    center: '',
    seminar: '',
    status: 'present',
    type: 'student'
  });

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [students, instructors, centers, seminars, attendance] = await Promise.all([
        usersAPI.getStudents(),
        usersAPI.getInstructors(),
        centersAPI.getAll(),
        seminarsAPI.getAll(),
        attendanceAPI.getAll()
      ]);

      setData({
        students: students.data,
        instructors: instructors.data,
        centers: centers.data,
        seminars: seminars.data,
        attendance: attendance.data
      });

      setStats({
        students: students.data.length,
        instructors: instructors.data.length,
        centers: centers.data.length,
        seminars: seminars.data.length
      });

      setError('');
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCenter = async (e) => {
    e.preventDefault();
    try {
      await centersAPI.create(centerForm);
      setSuccess('Center created successfully!');
      setShowCenterModal(false);
      setCenterForm({ center_id: '', center_name: '', town: '', city: '' });
      fetchAllData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating center');
    }
  };

  const handleCreateSeminar = async (e) => {
    e.preventDefault();
    try {
      await seminarsAPI.create(seminarForm);
      setSuccess('Seminar created successfully!');
      setShowSeminarModal(false);
      setSeminarForm({
        title: '',
        description: '',
        date: '',
        center: '',
        instructor: '',
        status: 'scheduled'
      });
      fetchAllData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating seminar');
    }
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    try {
      if (attendanceForm.type === 'student') {
        await attendanceAPI.createStudent({
          date: attendanceForm.date,
          student_id: attendanceForm.student_id,
          center: attendanceForm.center,
          seminar: attendanceForm.seminar,
          status: attendanceForm.status
        });
      } else {
        await attendanceAPI.createInstructor({
          date: attendanceForm.date,
          instructor_id: attendanceForm.instructor_id,
          center: attendanceForm.center,
          seminar: attendanceForm.seminar,
          status: attendanceForm.status
        });
      }
      setSuccess('Attendance recorded successfully!');
      setShowAttendanceModal(false);
      setAttendanceForm({
        date: '',
        student_id: '',
        instructor_id: '',
        center: '',
        seminar: '',
        status: 'present',
        type: 'student'
      });
      fetchAllData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording attendance');
    }
  };

  const handleDeleteCenter = async (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        await centersAPI.delete(id);
        setSuccess('Center deleted successfully!');
        fetchAllData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting center');
      }
    }
  };

  const handleDeleteSeminar = async (id) => {
    if (window.confirm('Are you sure you want to delete this seminar?')) {
      try {
        await seminarsAPI.delete(id);
        setSuccess('Seminar deleted successfully!');
        fetchAllData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting seminar');
      }
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceAPI.delete(id);
        setSuccess('Attendance record deleted successfully!');
        fetchAllData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting attendance');
      }
    }
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
          <h2>Admin Dashboard</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>

        {/* Statistics Cards */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Students</h3>
            <div className="count">{stats.students}</div>
          </div>
          <div className="card">
            <h3>Total Instructors</h3>
            <div className="count">{stats.instructors}</div>
          </div>
          <div className="card">
            <h3>Total Centers</h3>
            <div className="count">{stats.centers}</div>
          </div>
          <div className="card">
            <h3>Total Seminars</h3>
            <div className="count">{stats.seminars}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'centers' ? 'active' : ''}`}
            onClick={() => setActiveTab('centers')}
          >
            Centers
          </button>
          <button 
            className={`tab ${activeTab === 'seminars' ? 'active' : ''}`}
            onClick={() => setActiveTab('seminars')}
          >
            Seminars
          </button>
          <button 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="section">
            <h3>System Overview</h3>
            <p>Welcome to the LMS Admin Dashboard. Use the tabs above to manage centers, seminars, attendance, and users.</p>
          </div>
        )}

        {activeTab === 'centers' && (
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Centers Management</h3>
              <button className="btn btn-success" onClick={() => setShowCenterModal(true)}>
                + Add Center
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Center ID</th>
                  <th>Center Name</th>
                  <th>Town</th>
                  <th>City</th>
                  <th>Instructors</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.centers.map(center => (
                  <tr key={center._id}>
                    <td>{center.center_id}</td>
                    <td>{center.center_name}</td>
                    <td>{center.town}</td>
                    <td>{center.city}</td>
                    <td>{center.instructors?.length || 0}</td>
                    <td>{center.students?.length || 0}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteCenter(center._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'seminars' && (
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Seminars Management</h3>
              <button className="btn btn-success" onClick={() => setShowSeminarModal(true)}>
                + Add Seminar
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Center</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.seminars.map(seminar => (
                  <tr key={seminar._id}>
                    <td>{seminar.title}</td>
                    <td>{new Date(seminar.date).toLocaleDateString()}</td>
                    <td>{seminar.center?.center_name}</td>
                    <td>{seminar.instructor?.name}</td>
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
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteSeminar(seminar._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Attendance Management</h3>
              <button className="btn btn-success" onClick={() => setShowAttendanceModal(true)}>
                + Add Attendance
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Center</th>
                  <th>Seminar</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.attendance.map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.student ? 'Student' : 'Instructor'}</td>
                    <td>{record.student_id || record.instructor_id}</td>
                    <td>{record.student?.name || record.instructor?.name}</td>
                    <td>{record.center?.center_name}</td>
                    <td>{record.seminar?.title || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: record.status === 'present' ? '#28a745' : '#dc3545',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteAttendance(record._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="section">
            <h3>Students</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Grade</th>
                  <th>Center</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map(student => (
                  <tr key={student._id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td>{student.gender}</td>
                    <td>{student.grade}</td>
                    <td>{student.center?.center_name || 'Not Assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: '40px' }}>Instructors</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Instructor ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {data.instructors.map(instructor => (
                  <tr key={instructor._id}>
                    <td>{instructor.instructor_id}</td>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Center Modal */}
        {showCenterModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Center</h3>
              <form onSubmit={handleCreateCenter}>
                <div className="form-group">
                  <label>Center ID</label>
                  <input
                    type="text"
                    value={centerForm.center_id}
                    onChange={(e) => setCenterForm({...centerForm, center_id: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Center Name</label>
                  <input
                    type="text"
                    value={centerForm.center_name}
                    onChange={(e) => setCenterForm({...centerForm, center_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Town</label>
                  <input
                    type="text"
                    value={centerForm.town}
                    onChange={(e) => setCenterForm({...centerForm, town: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={centerForm.city}
                    onChange={(e) => setCenterForm({...centerForm, city: e.target.value})}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Create</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowCenterModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Seminar Modal */}
        {showSeminarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Seminar</h3>
              <form onSubmit={handleCreateSeminar}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={seminarForm.title}
                    onChange={(e) => setSeminarForm({...seminarForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={seminarForm.description}
                    onChange={(e) => setSeminarForm({...seminarForm, description: e.target.value})}
                    rows="3"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={seminarForm.date}
                    onChange={(e) => setSeminarForm({...seminarForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Center</label>
                  <select
                    value={seminarForm.center}
                    onChange={(e) => setSeminarForm({...seminarForm, center: e.target.value})}
                    required
                  >
                    <option value="">Select Center</option>
                    {data.centers.map(center => (
                      <option key={center._id} value={center._id}>
                        {center.center_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <select
                    value={seminarForm.instructor}
                    onChange={(e) => setSeminarForm({...seminarForm, instructor: e.target.value})}
                  >
                    <option value="">Select Instructor (Optional)</option>
                    {data.instructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name} ({instructor.instructor_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={seminarForm.status}
                    onChange={(e) => setSeminarForm({...seminarForm, status: e.target.value})}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Create</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowSeminarModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Attendance Record</h3>
              <form onSubmit={handleAddAttendance}>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={attendanceForm.type}
                    onChange={(e) => setAttendanceForm({...attendanceForm, type: e.target.value})}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                    required
                  />
                </div>
                {attendanceForm.type === 'student' ? (
                  <div className="form-group">
                    <label>Student ID</label>
                    <input
                      type="text"
                      value={attendanceForm.student_id}
                      onChange={(e) => setAttendanceForm({...attendanceForm, student_id: e.target.value})}
                      required
                      placeholder="Enter student ID"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Instructor ID</label>
                    <input
                      type="text"
                      value={attendanceForm.instructor_id}
                      onChange={(e) => setAttendanceForm({...attendanceForm, instructor_id: e.target.value})}
                      required
                      placeholder="e.g., E-24-001"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Center</label>
                  <select
                    value={attendanceForm.center}
                    onChange={(e) => setAttendanceForm({...attendanceForm, center: e.target.value})}
                    required
                  >
                    <option value="">Select Center</option>
                    {data.centers.map(center => (
                      <option key={center._id} value={center._id}>
                        {center.center_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Seminar (Optional)</label>
                  <select
                    value={attendanceForm.seminar}
                    onChange={(e) => setAttendanceForm({...attendanceForm, seminar: e.target.value})}
                  >
                    <option value="">Select Seminar</option>
                    {data.seminars.map(seminar => (
                      <option key={seminar._id} value={seminar._id}>
                        {seminar.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={attendanceForm.status}
                    onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAttendanceModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
