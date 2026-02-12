const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');

    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ isSuperAdmin: true });
    if (existingSuperAdmin) {
      console.log('Super Admin already exists:');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Name:', existingSuperAdmin.name);
      process.exit(0);
    }

    // Super admin credentials
    const superAdminData = {
      name: 'Super Admin',
      email: 'superadmin@lms.com',
      password: 'SuperAdmin123', // Change this password after first login
      role: 'admin',
      isSuperAdmin: true
    };

    // Create super admin
    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super Admin created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', superAdminData.email);
    console.log('Password:', superAdminData.password);
    console.log('-----------------------------------');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
