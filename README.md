# Learning Management System (LMS)

A comprehensive Learning Management System built with React (Frontend), Node.js (Backend), and MongoDB.

## Features

### User Roles
- **Admin**: Full system management
- **Instructor**: View-only access with university email validation
- **Student**: View-only access with profile management

### Core Features
- ✅ User Authentication & Authorization
- ✅ Role-based Access Control
- ✅ Center Management
- ✅ Seminar Series Management
- ✅ Attendance Tracking (Students & Instructors)
- ✅ Dashboard for each role
- ✅ Real-time data updates

### Technical Stack
- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs

## Project Structure

```
LMS1/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── .env            # Environment variables
│   ├── server.js       # Server entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── services/    # API services
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Account (using MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with:
```
MONGODB_URI=mongodb+srv://heshandb:heshandb@cluster0.pbqtllv.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## User Types & Validation

### Admin
- Can manage all aspects of the system
- Can add centers, seminars, and attendance records
- Can view all users

### Instructor
- **Email Validation**: Must end with `@eng.pnd.ac.lk` (e.g., `heshan@eng.pnd.ac.lk`)
- **ID Format**: Must be `E-YY-XXX` (e.g., `E-24-001`)
- Can view seminars and their attendance records
- Read-only access

### Student
- Can view seminars and attendance
- Can see personal attendance history
- Read-only access

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/students/all` - Get all students
- `GET /api/users/instructors/all` - Get all instructors
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Centers
- `GET /api/centers` - Get all centers
- `POST /api/centers` - Create center (Admin)
- `PUT /api/centers/:id` - Update center (Admin)
- `DELETE /api/centers/:id` - Delete center (Admin)

### Seminars
- `GET /api/seminars` - Get all seminars
- `POST /api/seminars` - Create seminar (Admin)
- `PUT /api/seminars/:id` - Update seminar (Admin)
- `DELETE /api/seminars/:id` - Delete seminar (Admin)

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance/student` - Record student attendance (Admin)
- `POST /api/attendance/instructor` - Record instructor attendance (Admin)
- `POST /api/attendance/bulk` - Bulk create attendance (Admin)
- `GET /api/attendance/my/records` - Get my attendance (Student/Instructor)
- `DELETE /api/attendance/:id` - Delete attendance (Admin)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'instructor', 'student'],
  instructor_id: String (E-YY-XXX format),
  student_id: String,
  age: Number,
  gender: String,
  grade: String,
  center: ObjectId (ref: Center)
}
```

### Center
```javascript
{
  center_id: String (unique),
  center_name: String,
  town: String,
  city: String,
  instructors: [ObjectId],
  students: [ObjectId]
}
```

### Seminar
```javascript
{
  title: String,
  description: String,
  date: Date,
  center: ObjectId (ref: Center),
  instructor: ObjectId (ref: User),
  status: ['scheduled', 'completed', 'cancelled']
}
```

### Attendance
```javascript
{
  date: Date,
  seminar: ObjectId (ref: Seminar),
  student: ObjectId (ref: User),
  student_id: String,
  instructor: ObjectId (ref: User),
  instructor_id: String,
  center: ObjectId (ref: Center),
  status: ['present', 'absent', 'late'],
  notes: String
}
```

## Default Login Credentials

After registration, you can create users with these roles:

**Admin Account** (Create during registration)
- Role: Admin
- Email: admin@example.com
- Password: (your choice)

**Instructor Account** (Create during registration)
- Role: Instructor
- Email: heshan@eng.pnd.ac.lk
- Instructor ID: E-24-001
- Password: (your choice)

**Student Account** (Create during registration)
- Role: Student
- Email: student@example.com
- Student ID: (your choice)
- Password: (your choice)

## Features by Role

### Admin Dashboard
- View system statistics
- Manage centers (Create, View, Delete)
- Manage seminars (Create, View, Delete)
- Manage attendance (Add records for students and instructors)
- View all users (Students, Instructors)

### Instructor Dashboard
- View all seminars
- View personal attendance history
- View all centers
- Read-only access

### Student Dashboard
- View all seminars
- View personal attendance history
- View attendance rate
- View assigned center
- Read-only access

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # React hot reload enabled
```

## Production Deployment

### Backend
1. Set environment variables properly
2. Change JWT_SECRET to a secure random string
3. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend
1. Build the production app:
```bash
npm run build
```
2. Deploy build folder to Netlify, Vercel, or any static hosting

## Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Role-based authorization
- Email domain validation for instructors
- ID format validation

## Support

For issues or questions, please contact the development team.

## License

MIT License
