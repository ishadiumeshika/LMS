# Quick Start Guide

## Installation Steps

### 1. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd ../frontend
npm install
```

## Running the Application

### Start Backend (Terminal 1)
```powershell
cd backend
npm start
```
Backend will run on: http://localhost:5000

### Start Frontend (Terminal 2)
```powershell
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

## Testing the Application

### Register as an Instructor
1. Go to http://localhost:3000/register
2. Fill in the form:
   - University ID: E-23-001
   - Name: Your Name
   - Email: yourname@eng.pdn.ac.lk
   - Password: your_password
3. Click Register

### Login as Instructor
1. Go to http://localhost:3000/login
2. Use your email and password
3. You'll be redirected to the Instructor Dashboard

## Creating Test Data

### Create Admin User (Using MongoDB Compass or Shell)

Connect to: mongodb+srv://heshandb:heshandb@cluster1.xsho44w.mongodb.net/lms

Insert into 'users' collection:
```json
{
  "username": "admin",
  "password": "$2a$10$xyz...",  
  "role": "admin",
  "email": "admin@lms.com"
}
```

Note: You need to hash the password using bcrypt. Use password: "admin123" and hash it.

Alternatively, you can use this Node.js script:
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
bcrypt.hash(password, 10, (err, hash) => {
  console.log(hash);
});
```

### Create a Center Account
1. Login as admin
2. Go to Centers tab
3. Create a new center with login credentials

## Troubleshooting

### Backend won't start
- Make sure MongoDB connection string is correct in backend/config/db.js
- Check if port 5000 is available
- Install all dependencies: `npm install`

### Frontend won't start
- Check if port 3000 is available
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Can't connect to API
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in frontend code (http://localhost:5000)

### Authentication issues
- Clear browser localStorage
- Check JWT token in Network tab of browser DevTools
- Verify MongoDB connection and user documents

## Default URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Database Connection

Connection String: mongodb+srv://heshandb:heshandb@cluster1.xsho44w.mongodb.net/lms

You can view/edit data using:
- MongoDB Compass
- MongoDB Atlas Web Interface
