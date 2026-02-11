# How to Run the LMS Project

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
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

## Access the Application

Once both servers are running:
- **Frontend**: Open your browser and go to `http://localhost:3000`
- **Backend API**: Available at `http://localhost:5000`

## Default Users

The application supports four user roles:
- **Admin**: Full system management access
- **Center**: Center-specific management and attendance marking
- **Instructor**: View seminars and track personal attendance (can register at `/register`)
- **Student**: View seminars and track personal attendance

## Features

### Authentication
- Login at `/login`
- Instructor registration at `/register` (requires @eng.pdn.ac.lk email)

### Role-Based Dashboards
- Each user role has a dedicated dashboard with appropriate functionality
- Admin can manage students, centers, seminars, and view all data
- Center users can manage attendance and assign instructors
- Instructors and students can view seminars and track their attendance

## MongoDB Connection

The application is configured to connect to MongoDB Atlas. If the database connection fails, the server will continue running without database functionality. You can modify the connection string in `backend/config/db.js` if needed.

## Notes

- The backend runs on port 5000 by default
- The frontend runs on port 3000 by default
- The frontend is configured to proxy API requests to the backend
- CORS is enabled for all origins (modify in production)
