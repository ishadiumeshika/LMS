import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../Layout/Layout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [showSeminarForm, setShowSeminarForm] = useState(false);

  const [studentForm, setStudentForm] = useState({
    studentId: '', name: '', ageOrGrade: '', gender: 'Male', centerId: ''
  });

  const [centerForm, setCenterForm] = useState({
    centerId: '', centerName: '', town: '', city: '', inchargeInt: '', username: '', password: ''
  });

  const [seminarForm, setSeminarForm] = useState({
    title: '', description: '', date: '', time: '', venue: '', centerId: '', instructorId: ''
  });

  // Bulk attendance states
  const [bulkAttendanceType, setBulkAttendanceType] = useState('students');
  const [bulkAttendanceRows, setBulkAttendanceRows] = useState([
    { date: new Date().toISOString().split('T')[0], personId: '', inchargeInt: '' }
  ]);

  // View attendance states
  const [viewAttendanceType, setViewAttendanceType] = useState('students');
  const [viewAttendanceDate, setViewAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'instructors') fetchInstructors();
    if (activeTab === 'centers') fetchCenters();
    if (activeTab === 'seminars') fetchSeminars();
    if (activeTab === 'attendance') {
      fetchStudents();
      fetchInstructors();
      fetchCenters();
    }
    if (activeTab === 'overview') {
      fetchStudents();
      fetchInstructors();
      fetchCenters();
      fetchSeminars();
    }
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

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
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

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students', studentForm);
      alert('Student created successfully!');
      setShowStudentForm(false);
      setStudentForm({ studentId: '', name: '', ageOrGrade: '', gender: 'Male', centerId: '' });
      fetchStudents();
    } catch (error) {
      alert('Error creating student: ' + error.response?.data?.message);
    }
  };

  const handleCreateCenter = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/centers', centerForm);
      alert('Center created successfully!');
      setShowCenterForm(false);
      setCenterForm({ centerId: '', centerName: '', town: '', city: '', inchargeInt: '', username: '', password: '' });
      fetchCenters();
    } catch (error) {
      alert('Error creating center: ' + error.response?.data?.message);
    }
  };

  const handleCreateSeminar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/seminars', seminarForm);
      alert('Seminar created successfully!');
      setShowSeminarForm(false);
      setSeminarForm({ title: '', description: '', date: '', time: '', venue: '', centerId: '', instructorId: '' });
      fetchSeminars();
    } catch (error) {
      alert('Error creating seminar: ' + error.response?.data?.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        alert('Error deleting student: ' + error.response?.data?.message);
      }
    }
  };

  const handleDeleteSeminar = async (id) => {
    if (window.confirm('Are you sure you want to delete this seminar?')) {
      try {
        await axios.delete(`http://localhost:5000/api/seminars/${id}`);
        alert('Seminar deleted successfully!');
        fetchSeminars();
      } catch (error) {
        alert('Error deleting seminar: ' + error.response?.data?.message);
      }
    }
  };

  const addBulkAttendanceRow = () => {
    setBulkAttendanceRows([
      ...bulkAttendanceRows,
      { date: new Date().toISOString().split('T')[0], personId: '', inchargeInt: '' }
    ]);
  };

  const removeBulkAttendanceRow = (index) => {
    setBulkAttendanceRows(bulkAttendanceRows.filter((_, i) => i !== index));
  };

  const updateBulkAttendanceRow = (index, field, value) => {
    const updatedRows = [...bulkAttendanceRows];
    updatedRows[index][field] = value;
    setBulkAttendanceRows(updatedRows);
  };

  const handleBulkAttendanceSubmit = async () => {
    try {
      // Validate all rows have required fields
      const invalidRows = bulkAttendanceRows.filter(row => !row.date || !row.personId || !row.inchargeInt);
      if (invalidRows.length > 0) {
        alert('Please fill all required fields (Date, Person ID, Incharge Int)');
        return;
      }

      // Find center by incharge int
      const recordsWithCenter = [];
      for (const row of bulkAttendanceRows) {
        const center = centers.find(c => c.inchargeInt === parseInt(row.inchargeInt));
        if (!center) {
          alert(`No center found with incharge int: ${row.inchargeInt}`);
          return;
        }
        recordsWithCenter.push({
          date: row.date,
          [bulkAttendanceType === 'students' ? 'studentId' : 'instructorId']: row.personId,
          centerId: center._id,
          status: 'present'
        });
      }

      const endpoint = bulkAttendanceType === 'students' 
        ? 'http://localhost:5000/api/attendance/students/bulk'
        : 'http://localhost:5000/api/attendance/instructors/bulk';

      const response = await axios.post(endpoint, { records: recordsWithCenter });
      
      // Build detailed message
      let message = `${response.data.message}\n\nSuccessfully created: ${response.data.results.success.length}\nFailed: ${response.data.results.failed.length}`;
      
      // Show error details if there are failures
      if (response.data.results.failed.length > 0) {
        message += '\n\nFailure details:';
        response.data.results.failed.forEach((fail, index) => {
          const personId = bulkAttendanceType === 'students' ? fail.record.studentId : fail.record.instructorId;
          message += `\n${index + 1}. ${personId}: ${fail.error}`;
        });
      }
      
      alert(message);
      
      // Reset form only if all succeeded
      if (response.data.results.failed.length === 0) {
        setBulkAttendanceRows([
          { date: new Date().toISOString().split('T')[0], personId: '', inchargeInt: '' }
        ]);
      }
    } catch (error) {
      alert('Error submitting bulk attendance: ' + error.response?.data?.message);
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        
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
          <button className={activeTab === 'centers' ? 'active' : ''} onClick={() => setActiveTab('centers')}>
            Centers
          </button>
          <button className={activeTab === 'seminars' ? 'active' : ''} onClick={() => setActiveTab('seminars')}>
            Seminars
          </button>
          <button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
            Attendance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h3>System Overview</h3>
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
                  <h4>Total Centers</h4>
                  <p className="stat-number">{centers.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Seminars</h4>
                  <p className="stat-number">{seminars.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-section">
              <div className="section-header">
                <h3>Manage Students</h3>
                <button className="btn-primary" onClick={() => setShowStudentForm(!showStudentForm)}>
                  {showStudentForm ? 'Cancel' : 'Add Student'}
                </button>
              </div>

              {showStudentForm && (
                <form className="form-card" onSubmit={handleCreateStudent}>
                  <input type="text" placeholder="Student ID" value={studentForm.studentId} 
                    onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})} required />
                  <input type="text" placeholder="Name" value={studentForm.name} 
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} required />
                  <input type="text" placeholder="Age/Grade" value={studentForm.ageOrGrade} 
                    onChange={(e) => setStudentForm({...studentForm, ageOrGrade: e.target.value})} required />
                  <select value={studentForm.gender} 
                    onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select value={studentForm.centerId} 
                    onChange={(e) => setStudentForm({...studentForm, centerId: e.target.value})} required>
                    <option value="">Select Center</option>
                    {centers.map(center => (
                      <option key={center._id} value={center._id}>{center.centerName}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-primary">Create Student</button>
                </form>
              )}

              {loading ? <p>Loading...</p> : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Age/Grade</th>
                      <th>Gender</th>
                      <th>Center</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id}>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.ageOrGrade}</td>
                        <td>{student.gender}</td>
                        <td>{student.centerId?.centerName || 'N/A'}</td>
                        <td>
                          <button className="btn-delete" onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'instructors' && (
            <div className="instructors-section">
              <h3>Manage Instructors</h3>
              {loading ? <p>Loading...</p> : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>University ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Center</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map(instructor => (
                      <tr key={instructor._id}>
                        <td>{instructor.universityId}</td>
                        <td>{instructor.name}</td>
                        <td>{instructor.email}</td>
                        <td>{instructor.centerId?.centerName || 'Not Assigned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'centers' && (
            <div className="centers-section">
              <div className="section-header">
                <h3>Manage Centers</h3>
                <button className="btn-primary" onClick={() => setShowCenterForm(!showCenterForm)}>
                  {showCenterForm ? 'Cancel' : 'Add Center'}
                </button>
              </div>

              {showCenterForm && (
                <form className="form-card" onSubmit={handleCreateCenter}>
                  <input type="text" placeholder="Center ID" value={centerForm.centerId} 
                    onChange={(e) => setCenterForm({...centerForm, centerId: e.target.value})} required />
                  <input type="text" placeholder="Center Name" value={centerForm.centerName} 
                    onChange={(e) => setCenterForm({...centerForm, centerName: e.target.value})} required />
                  <input type="text" placeholder="Town" value={centerForm.town} 
                    onChange={(e) => setCenterForm({...centerForm, town: e.target.value})} required />
                  <input type="text" placeholder="City" value={centerForm.city} 
                    onChange={(e) => setCenterForm({...centerForm, city: e.target.value})} required />
                  <input type="number" placeholder="Incharge Int" value={centerForm.inchargeInt} 
                    onChange={(e) => setCenterForm({...centerForm, inchargeInt: e.target.value})} required />
                  <input type="text" placeholder="Username (for login)" value={centerForm.username} 
                    onChange={(e) => setCenterForm({...centerForm, username: e.target.value})} required />
                  <input type="password" placeholder="Password" value={centerForm.password} 
                    onChange={(e) => setCenterForm({...centerForm, password: e.target.value})} required />
                  <button type="submit" className="btn-primary">Create Center</button>
                </form>
              )}

              {loading ? <p>Loading...</p> : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Center ID</th>
                      <th>Name</th>
                      <th>Town</th>
                      <th>City</th>
                      <th>Incharge Int</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centers.map(center => (
                      <tr key={center._id}>
                        <td>{center.centerId}</td>
                        <td>{center.centerName}</td>
                        <td>{center.town}</td>
                        <td>{center.city}</td>
                        <td>{center.inchargeInt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'seminars' && (
            <div className="seminars-section">
              <div className="section-header">
                <h3>Manage Seminar Series</h3>
                <button className="btn-primary" onClick={() => setShowSeminarForm(!showSeminarForm)}>
                  {showSeminarForm ? 'Cancel' : 'Add Seminar'}
                </button>
              </div>

              {showSeminarForm && (
                <form className="form-card" onSubmit={handleCreateSeminar}>
                  <input type="text" placeholder="Title" value={seminarForm.title} 
                    onChange={(e) => setSeminarForm({...seminarForm, title: e.target.value})} required />
                  <textarea placeholder="Description" value={seminarForm.description} 
                    onChange={(e) => setSeminarForm({...seminarForm, description: e.target.value})} required />
                  <input type="date" value={seminarForm.date} 
                    onChange={(e) => setSeminarForm({...seminarForm, date: e.target.value})} required />
                  <input type="time" value={seminarForm.time} 
                    onChange={(e) => setSeminarForm({...seminarForm, time: e.target.value})} required />
                  <input type="text" placeholder="Venue" value={seminarForm.venue} 
                    onChange={(e) => setSeminarForm({...seminarForm, venue: e.target.value})} required />
                  <select value={seminarForm.centerId} 
                    onChange={(e) => setSeminarForm({...seminarForm, centerId: e.target.value})}>
                    <option value="">Select Center (Optional)</option>
                    {centers.map(center => (
                      <option key={center._id} value={center._id}>{center.centerName}</option>
                    ))}
                  </select>
                  <select value={seminarForm.instructorId} 
                    onChange={(e) => setSeminarForm({...seminarForm, instructorId: e.target.value})}>
                    <option value="">Select Instructor (Optional)</option>
                    {instructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-primary">Create Seminar</button>
                </form>
              )}

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
                      <button className="btn-delete" onClick={() => handleDeleteSeminar(seminar._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-section">
              <h3>Bulk Attendance Management</h3>
              
              <div className="bulk-attendance-type">
                <label>
                  <input 
                    type="radio" 
                    value="students" 
                    checked={bulkAttendanceType === 'students'} 
                    onChange={(e) => setBulkAttendanceType(e.target.value)}
                  />
                  Students
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="instructors" 
                    checked={bulkAttendanceType === 'instructors'} 
                    onChange={(e) => setBulkAttendanceType(e.target.value)}
                  />
                  Instructors
                </label>
              </div>

              {/* Quick Reference */}
              <details className="reference-section">
                <summary>📋 Quick Reference - Available IDs</summary>
                <div className="reference-content">
                  <div className="reference-column">
                    <h4>Centers & Incharge Int</h4>
                    {centers.length === 0 ? (
                      <p className="no-data">No centers available. Create centers first.</p>
                    ) : (
                      <ul>
                        {centers.map(c => (
                          <li key={c._id}>
                            <strong>{c.centerName}</strong> - Incharge Int: <span className="highlight">{c.inchargeInt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {bulkAttendanceType === 'students' ? (
                    <div className="reference-column">
                      <h4>Available Student IDs</h4>
                      {students.length === 0 ? (
                        <p className="no-data">No students available. Create students first.</p>
                      ) : (
                        <ul>
                          {students.slice(0, 10).map(s => (
                            <li key={s._id}>
                              <strong>{s.studentId}</strong> - {s.name}
                            </li>
                          ))}
                          {students.length > 10 && <li>...and {students.length - 10} more</li>}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="reference-column">
                      <h4>Available Instructor University IDs</h4>
                      {instructors.length === 0 ? (
                        <p className="no-data">No instructors available. Register instructors first.</p>
                      ) : (
                        <ul>
                          {instructors.map(i => (
                            <li key={i._id}>
                              <strong>{i.universityId}</strong> - {i.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </details>
              
              <p className="attendance-help-text">
                {bulkAttendanceType === 'students' 
                  ? 'Enter Student ID, Date, and Incharge Int for each record.' 
                  : 'Enter University ID (e.g., E-23-001), Date, and Incharge Int for each record.'}
              </p>

              <table className="data-table bulk-attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>{bulkAttendanceType === 'students' ? 'Student ID' : 'University ID'}</th>
                    <th>Incharge Int</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkAttendanceRows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input 
                          type="date" 
                          value={row.date}
                          onChange={(e) => updateBulkAttendanceRow(index, 'date', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder={bulkAttendanceType === 'students' ? 'Student ID' : 'University ID (E-YY-XXX)'}
                          value={row.personId}
                          onChange={(e) => updateBulkAttendanceRow(index, 'personId', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          placeholder="Incharge Int"
                          value={row.inchargeInt}
                          onChange={(e) => updateBulkAttendanceRow(index, 'inchargeInt', e.target.value)}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn-delete" 
                          onClick={() => removeBulkAttendanceRow(index)}
                          disabled={bulkAttendanceRows.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bulk-attendance-actions">
                <button className="btn-secondary" onClick={addBulkAttendanceRow}>
                  Add Row
                </button>
                <button className="btn-primary" onClick={handleBulkAttendanceSubmit}>
                  Submit Attendance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;