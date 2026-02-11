# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024

### Added
- Initial release of Learning Management System (LMS)
- User authentication with role-based access control (Admin, Center, Instructor, Student)
- Student management system with CRUD operations
- Instructor registration with university email validation (@eng.pdn.ac.lk)
- Center management with assignment capabilities
- Seminar series management and scheduling
- Attendance tracking for both students and instructors
- Admin dashboard with full system management
- Center dashboard with attendance marking features
- Instructor dashboard with personal attendance tracking
- Student dashboard with personal attendance tracking
- MongoDB integration with MongoDB Atlas
- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled for cross-origin requests
- Comprehensive API endpoints for all entities
- React-based frontend with modern UI
- React Router for navigation
- Axios for API communication
- Context API for state management
- Health check endpoint
- Error handling middleware
- Comprehensive documentation (README, QUICKSTART, TESTING_GUIDE)
- Setup script for Windows (setup.ps1)
- Admin creation utility script

### Security
- Role-based access control implemented
- Protected routes with authentication middleware
- Password hashing with bcrypt
- JWT token validation
- Input validation for university email and ID formats

## [Unreleased]

### Planned Features
- Email notifications for seminars
- Attendance reports and analytics
- File upload for course materials
- Real-time updates using WebSockets
- Mobile app support
- Advanced search and filtering
- Bulk attendance marking
- Export data to Excel/PDF
- Two-factor authentication
- Password reset functionality
- User profile management
- Activity logs and audit trails

---

## Version History

- **1.0.0** - Initial release with core LMS features
