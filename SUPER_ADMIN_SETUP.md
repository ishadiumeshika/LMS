# Super Admin Setup Guide

## Overview
This LMS system has been configured with a Super Admin role hierarchy:
- **Super Admin**: Can register and manage other admins (only one super admin exists)
- **Regular Admins**: Can manage the system but cannot register other admins
- **Instructors & Students**: Can register themselves through the public registration page

## Initial Setup

### Step 1: Create the Super Admin Account

Run the setup script to create the initial super admin:

```bash
cd backend
node scripts/createSuperAdmin.js
```

**Default Super Admin Credentials:**
- Email: `superadmin@lms.com`
- Password: `SuperAdmin123`

⚠️ **IMPORTANT**: Change the password immediately after first login!

### Step 2: Login as Super Admin

1. Start the application (backend and frontend)
2. Navigate to the login page
3. Login with the super admin credentials
4. You should see the Admin Dashboard with additional privileges

### Step 3: Register Other Admins (Super Admin Only)

As the super admin, you can register other admins:

1. Go to Admin Dashboard
2. Click on the "Users" tab
3. Click the "+ Register Admin" button (only visible to super admin)
4. Fill in the admin details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
5. Click "Register Admin"

The newly registered admin will have regular admin privileges but cannot register other admins.

## Access Control

### Public Registration
- **Students**: ✅ Can register themselves
- **Instructors**: ✅ Can register themselves (requires @eng.pdn.ac.lk email)
- **Admins**: ❌ Cannot register themselves

### Admin Registration
- Only the **Super Admin** can register new admins
- Regular admins do not have access to admin registration

## Features

### Super Admin Exclusive Features:
1. **View Admin List**: See all admins in the system
2. **Register New Admins**: Add new admin accounts
3. **Admin Statistics**: View total admin count in dashboard

### Regular Admin Features:
- Manage students, instructors, centers, seminars, and attendance
- Cannot register other admins
- Cannot view admin list

## Security Notes

1. **Super Admin Account**: 
   - Only ONE super admin should exist in the system
   - Keep credentials secure and change the default password
   - This account has the highest privileges

2. **Admin Registration**:
   - All admin registrations must go through the super admin
   - No public admin registration is allowed
   - This ensures controlled access to administrative functions

3. **Password Requirements**:
   - Minimum 6 characters
   - Change default passwords immediately

## Troubleshooting

### Super Admin Already Exists
If you run the setup script and a super admin already exists, you'll see:
```
Super Admin already exists:
Email: [existing email]
Name: [existing name]
```

### Cannot See Admin Registration Button
- Verify you're logged in as the super admin
- Check that `isSuperAdmin` is `true` in your user profile
- Regular admins will not see this button

### API Endpoint for Admin Registration
```
POST /api/auth/register-admin
Headers: Authorization: Bearer [super-admin-token]
Body: {
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

## Database Schema Changes

The User model now includes:
```javascript
{
  ...existing fields,
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
}
```

Only the initial super admin account has `isSuperAdmin: true`.
