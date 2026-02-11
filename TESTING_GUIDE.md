# LMS System Overview & Testing Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Login     │  │  Register    │  │  Dashboards  │      │
│  │              │  │ (Instructor) │  │   by Role    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Students │  │Instructors│ │  Centers │   │
│  │  Routes  │  │  Routes  │  │  Routes   │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                 │
│  │ Seminars │  │Attendance│                                 │
│  │  Routes  │  │  Routes  │                                 │
│  └──────────┘  └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB Atlas)                    │
│  Collections: users, students, instructors, centers,        │
│              seminars, studentattendances,                   │
│              instructorattendances                           │
└─────────────────────────────────────────────────────────────┘
```

## User Roles & Permissions

### 1. ADMIN
**Can perform:**
- ✅ Create, read, update, delete Students
- ✅ Create, read, update, delete Centers
- ✅ Create, read, update, delete Seminars
- ✅ View all Instructors
- ✅ View all Attendance records
- ✅ Full system management

**Cannot perform:**
- ❌ Register as an Instructor (instructors register themselves)

### 2. CENTER
**Can perform:**
- ✅ View students at their center
- ✅ View all instructors
- ✅ Assign instructors to their center
- ✅ Mark attendance for students
- ✅ Mark attendance for instructors
- ✅ View seminar series

**Cannot perform:**
- ❌ Create/delete students
- ❌ Create/delete seminars
- ❌ Access other centers' data

### 3. INSTRUCTOR
**Can perform:**
- ✅ View all seminar series
- ✅ View their own attendance records
- ✅ Register themselves with @eng.pdn.ac.lk email

**Cannot perform:**
- ❌ Manage students
- ❌ Mark attendance
- ❌ Create seminars

### 4. STUDENT
**Can perform:**
- ✅ View all seminar series
- ✅ View their own attendance records

**Cannot perform:**
- ❌ Any management functions

## Testing Scenarios

### Scenario 1: Instructor Registration and Login
1. Navigate to http://localhost:3000/register
2. Fill in details:
   - University ID: `E-23-001`
   - Name: `John Doe`
   - Email: `john@eng.pdn.ac.lk`
   - Password: `password123`
3. Submit registration
4. Login with the email and password
5. Verify redirect to Instructor Dashboard
6. Check available tabs: View Seminars, My Attendance

### Scenario 2: Admin Creates Center and Students
1. Login as admin (username: `admin`, password: `admin123`)
2. Navigate to Centers tab
3. Create a new center:
   - Center ID: `CTR001`
   - Center Name: `Colombo Center`
   - Town: `Colombo`
   - City: `Western`
   - Incharge Int: `123`
   - Username: `colombo_center`
   - Password: `center123`
4. Navigate to Students tab
5. Create new students:
   - Student ID: `S001`
   - Name: `Alice Smith`
   - Age/Grade: `Grade 10`
   - Gender: `Female`
   - Center: Select "Colombo Center"
6. Create more students as needed
7. Verify students appear in the table

### Scenario 3: Center Marks Attendance
1. Logout from admin
2. Login as center (username: `colombo_center`, password: `center123`)
3. Navigate to "Mark Attendance" tab
4. Select today's date
5. Choose "Students" from dropdown
6. Mark attendance for each student (Present/Absent/Late)
7. Switch to "Instructors" in dropdown
8. Mark instructor attendance
9. Navigate to Students/Instructors tabs to verify

### Scenario 4: Admin Creates Seminars
1. Login as admin
2. Navigate to Seminars tab
3. Create new seminar:
   - Title: `Introduction to Machine Learning`
   - Description: `Basic concepts of ML`
   - Date: Select future date
   - Time: `14:00`
   - Venue: `Main Hall`
   - Center: Select a center (optional)
   - Instructor: Select an instructor (optional)
4. Submit form
5. Verify seminar appears in grid
6. Logout and login as Instructor
7. Verify seminar is visible in Instructor Dashboard

### Scenario 5: Center Assigns Instructors
1. Login as center
2. Navigate to Instructors tab
3. Find instructors with "Not Assigned" center
4. Click "Assign to My Center" button
5. Verify center is now assigned
6. Check that instructor now appears under your center

### Scenario 6: View Attendance Records
1. Login as instructor
2. Navigate to "My Attendance" tab
3. View all attendance records marked by centers
4. Verify date, status, and who marked it
5. Logout and login as student (if student account exists)
6. Navigate to "My Attendance" tab
7. View personal attendance records

## Sample Data for Testing

### Sample Centers
```
Center 1:
- ID: CTR001
- Name: Colombo Learning Center
- Town: Colombo 07
- City: Western Province
- Incharge: 1001

Center 2:
- ID: CTR002
- Name: Kandy Education Center
- Town: Kandy
- City: Central Province
- Incharge: 1002
```

### Sample Students
```
Student 1:
- ID: S2023001
- Name: Amara Fernando
- Age/Grade: Grade 11
- Gender: Male
- Center: CTR001

Student 2:
- ID: S2023002
- Name: Nisha Perera
- Age/Grade: Grade 10
- Gender: Female
- Center: CTR001
```

### Sample Instructors
```
Instructor 1:
- University ID: E-23-001
- Name: Dr. Kamal Silva
- Email: kamal@eng.pdn.ac.lk

Instructor 2:
- University ID: E-23-002
- Name: Dr. Priya Jayawardena
- Email: priya@eng.pdn.ac.lk
```

### Sample Seminars
```
Seminar 1:
- Title: Advanced Web Development
- Description: Learn React, Node.js, and MongoDB
- Date: 2026-03-15
- Time: 14:00
- Venue: Computer Lab A

Seminar 2:
- Title: Data Science Fundamentals
- Description: Introduction to data analysis and ML
- Date: 2026-03-20
- Time: 10:00
- Venue: Main Hall
```

## API Testing with Postman/Thunder Client

### Login Request
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Get All Students (with token)
```http
GET http://localhost:5000/api/students
Authorization: Bearer <your_jwt_token>
```

### Create Seminar (admin only)
```http
POST http://localhost:5000/api/seminars
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "title": "Test Seminar",
  "description": "Test description",
  "date": "2026-03-15",
  "time": "14:00",
  "venue": "Room 101"
}
```

## Key Validation Rules

1. **Instructor Email**: Must end with `@eng.pdn.ac.lk`
2. **University ID**: Must match format `E-YY-XXX` (e.g., E-23-001)
3. **Student Gender**: Must be either "Male" or "Female"
4. **Attendance**: Cannot mark duplicate attendance for same person on same date
5. **Role-based Access**: Routes protected by role middleware

## Common Issues & Solutions

### Issue: Cannot login
- **Solution**: Check username/password, verify user exists in database
- **Admin credentials**: username: `admin`, password: `admin123`

### Issue: Instructor registration fails
- **Solution**: Ensure email ends with @eng.pdn.ac.lk
- **Solution**: Ensure University ID follows E-YY-XXX format

### Issue: Cannot mark attendance
- **Solution**: Ensure you're logged in as Center or Admin
- **Solution**: Check if attendance already marked for that date

### Issue: Token expired
- **Solution**: Logout and login again
- **Solution**: Token valid for 7 days

### Issue: CORS error
- **Solution**: Ensure backend is running on port 5000
- **Solution**: Check backend CORS configuration in server.js

## Database Collections Structure

### users
- username (String, unique)
- password (String, hashed)
- role (String: admin, center, instructor, student)
- email (String, optional)
- referenceId (ObjectId)
- referenceModel (String)

### centers
- centerId (String, unique)
- centerName (String)
- town (String)
- city (String)
- inchargeInt (Number)

### instructors
- universityId (String, unique, format: E-YY-XXX)
- name (String)
- email (String, unique, @eng.pdn.ac.lk)
- centerId (ObjectId, ref: Center)

### students
- studentId (String, unique)
- name (String)
- ageOrGrade (String)
- gender (String: Male/Female)
- centerId (ObjectId, ref: Center)

### seminars
- title (String)
- description (String)
- date (Date)
- time (String)
- venue (String)
- centerId (ObjectId, ref: Center)
- instructorId (ObjectId, ref: Instructor)
- status (String: scheduled, ongoing, completed, cancelled)

### studentattendances
- date (Date)
- studentId (ObjectId, ref: Student)
- centerId (ObjectId, ref: Center)
- status (String: present, absent, late)
- markedBy (ObjectId, ref: User)

### instructorattendances
- date (Date)
- instructorId (ObjectId, ref: Instructor)
- centerId (ObjectId, ref: Center)
- status (String: present, absent, late)
- markedBy (ObjectId, ref: User)

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update MongoDB connection string for production
- [ ] Configure CORS for specific origins only
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Create database backups
- [ ] Set up environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up monitoring and alerts
- [ ] Create comprehensive API documentation
- [ ] Perform security audit
- [ ] Test all user scenarios
- [ ] Optimize database queries with indexes
- [ ] Set up CI/CD pipeline

## Contact & Support

For issues, questions, or feature requests, please refer to the README.md file or contact the development team.
