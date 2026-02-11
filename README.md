# Learning Management System (LMS)

A comprehensive Learning Management System built with React, Node.js, Express, and MongoDB.

## Features

### User Roles
- **Admin**: Full system management access
- **Center**: Center-specific management and attendance marking
- **Instructor**: View seminars and track personal attendance
- **Student**: View seminars and track personal attendance

### Core Functionality
- User authentication with role-based access control
- Student management (Admin only)
- Instructor management with university email validation (@eng.pdn.ac.lk)
- Center management
- Seminar series management
- Attendance tracking for students and instructors
- Center assignment for instructors

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management

## Project Structure

```
LMS/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Student.js            # Student model
│   │   ├── Instructor.js         # Instructor model
│   │   ├── Center.js             # Center model
│   │   ├── Seminar.js            # Seminar model
│   │   └── Attendance.js         # Attendance models
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── students.js           # Student routes
│   │   ├── instructors.js        # Instructor routes
│   │   ├── centers.js            # Center routes
│   │   ├── seminars.js           # Seminar routes
│   │   └── attendance.js         # Attendance routes
│   ├── server.js                 # Express server
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Login.css
    │   │   │   ├── Register.jsx
    │   │   │   └── Register.css
    │   │   ├── Dashboard/
    │   │   │   ├── AdminDashboard/
    │   │   │   ├── CenterDashboard/
    │   │   │   ├── InstructorDashboard/
    │   │   │   └── StudentDashboard/
    │   │   └── Layout/
    │   │       ├── Layout.jsx
    │   │       └── Layout.css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.jsx
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The MongoDB connection is already configured to:
```
mongodb+srv://heshandb:heshandb@cluster1.xsho44w.mongodb.net/lms
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### Instructor Registration
- Instructors can register at `/register`
- Must use an email ending with `@eng.pdn.ac.lk`
- University ID must follow format: `E-YY-XXX` (e.g., E-23-001)

### Admin Functions
1. **Login** as admin
2. **Manage Students**: Create, view, and delete students
3. **Manage Centers**: Create and manage learning centers
4. **Manage Seminars**: Create and schedule seminar series
5. **View Instructors**: View all registered instructors
6. **View Attendance**: Access all attendance records

### Center Functions
1. **View Students**: See students enrolled at their center
2. **View Instructors**: See all instructors
3. **Assign Instructors**: Assign instructors to their center
4. **Mark Attendance**: Mark daily attendance for students and instructors
5. **View Seminars**: Access seminar series information

### Instructor Functions
1. **View Seminars**: See all scheduled seminars
2. **Track Attendance**: View personal attendance records

### Student Functions
1. **View Seminars**: See all scheduled seminars
2. **Track Attendance**: View personal attendance records

## Data Models

### Center
- Center ID
- Center Name
- Town
- City
- Incharge Int

### Instructor
- University ID (E-YY-XXX format)
- Name
- Email (@eng.pdn.ac.lk only)
- Center Assignment

### Student
- Student ID
- Name
- Age/Grade
- Gender (Male/Female)
- Center ID

### Seminar
- Title
- Description
- Date
- Time
- Venue
- Center (optional)
- Instructor (optional)
- Status (scheduled, ongoing, completed, cancelled)

### Attendance
Two separate tables:
- **Student Attendance**: Date | Student ID | Center ID | Status
- **Instructor Attendance**: Date | Instructor ID | Center ID | Status

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/instructor` - Instructor registration
- `GET /api/auth/me` - Get current user profile

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student (Admin only)
- `DELETE /api/students/:id` - Delete student (Admin only)

### Instructors
- `GET /api/instructors` - Get all instructors
- `GET /api/instructors/:id` - Get single instructor
- `PUT /api/instructors/:id/assign-center` - Assign instructor to center

### Centers
- `GET /api/centers` - Get all centers
- `GET /api/centers/:id` - Get single center
- `POST /api/centers` - Create center (Admin only)
- `PUT /api/centers/:id` - Update center (Admin only)
- `DELETE /api/centers/:id` - Delete center (Admin only)

### Seminars
- `GET /api/seminars` - Get all seminars
- `GET /api/seminars/:id` - Get single seminar
- `POST /api/seminars` - Create seminar (Admin only)
- `PUT /api/seminars/:id` - Update seminar (Admin only)
- `DELETE /api/seminars/:id` - Delete seminar (Admin only)

### Attendance
- `GET /api/attendance/students` - Get student attendance
- `GET /api/attendance/instructors` - Get instructor attendance
- `POST /api/attendance/students` - Mark student attendance
- `POST /api/attendance/instructors` - Mark instructor attendance
- `PUT /api/attendance/students/:id` - Update student attendance
- `PUT /api/attendance/instructors/:id` - Update instructor attendance

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Email validation for instructors
- University ID format validation

## Default Setup

### Creating an Admin User
To create an admin user, you'll need to manually insert a document into the MongoDB database with role 'admin'. You can use MongoDB Compass or the MongoDB shell.

Example admin user:
```javascript
{
  username: "admin",
  password: "hashed_password", // Use bcrypt to hash
  role: "admin",
  email: "admin@lms.com"
}
```

## Development Notes

### Backend Port
- Default: 5000
- Can be changed in `.env` file

### Frontend Port
- Default: 3000 (React default)

### CORS
- Backend is configured to accept requests from all origins
- Modify in `server.js` for production

## Future Enhancements
- Email notifications for seminars
- Attendance reports and analytics
- File upload for course materials
- Real-time updates using WebSockets
- Mobile app support
- Advanced search and filtering
- Bulk attendance marking
- Export data to Excel/PDF

## Support
For issues or questions, please contact the development team.

## License
Private - Educational Use Only
#   L M S  
 #   L M S  
 