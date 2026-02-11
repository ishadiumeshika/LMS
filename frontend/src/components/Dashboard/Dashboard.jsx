import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import CenterDashboard from './CenterDashboard/CenterDashboard';
import InstructorDashboard from './InstructorDashboard/InstructorDashboard';
import StudentDashboard from './StudentDashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'center':
        return <CenterDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default Dashboard;
