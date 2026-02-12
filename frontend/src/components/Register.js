import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { centersAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    instructor_id: '',
    student_id: '',
    age: '',
    gender: '',
    grade: '',
    center: ''
  });
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await centersAPI.getPublic();
      setCenters(response.data);
    } catch (err) {
      console.error('Error fetching centers:', err);
      setCenters([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate instructor email
    if (formData.role === 'instructor' && !formData.email.endsWith('@eng.pdn.ac.lk')) {
      setError('Instructor email must be from @eng.pdn.ac.lk domain (e.g., heshan@eng.pdn.ac.lk)');
      setLoading(false);
      return;
    }

    // Validate instructor ID format
    if (formData.role === 'instructor' && !/^E-\d{2}-\d{3}$/.test(formData.instructor_id)) {
      setError('Instructor ID must be in format E-YY-XXX (e.g., E-24-001)');
      setLoading(false);
      return;
    }

    try {
      // Prepare data based on role
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'instructor') {
        registrationData.instructor_id = formData.instructor_id;
      } else if (formData.role === 'student') {
        registrationData.student_id = formData.student_id;
        registrationData.age = formData.age;
        registrationData.gender = formData.gender;
        registrationData.grade = formData.grade;
        registrationData.center = formData.center;
      }

      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register to LMS</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={
                formData.role === 'instructor' 
                  ? 'e.g., heshan@eng.pdn.ac.lk' 
                  : 'Enter your email'
              }
            />
            {formData.role === 'instructor' && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                Instructor email must end with @eng.pdn.ac.lk
              </small>
            )}
          </div>

          {formData.role === 'instructor' && (
            <div className="form-group">
              <label>Instructor ID</label>
              <input
                type="text"
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleChange}
                required
                placeholder="e.g., E-24-001"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Format: E-YY-XXX (E-24-001)
              </small>
            </div>
          )}

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  required
                  placeholder="Enter student ID"
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="Enter age"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  placeholder="Enter grade"
                />
              </div>

              <div className="form-group">
                <label>Center</label>
                <select name="center" value={formData.center} onChange={handleChange} required>
                  <option value="">Select Center</option>
                  {centers.map(center => (
                    <option key={center._id} value={center._id}>
                      {center.center_name} - {center.city}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password (min 6 characters)"
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
