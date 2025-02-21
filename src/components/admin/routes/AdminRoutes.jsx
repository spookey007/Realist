// src/components/admin/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../AdminLayout'; // Import the AdminLayout
import Dashboard from '../Dashboard'; // Import your admin components
import Appointments from '../Appointments'; // Other admin components
import Users from '../Users'; // Other admin components

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="appointments" element={<Appointments />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
