// src/components/admin/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../AdminLayout"; // Import the AdminLayout
import Dashboard from "../Dashboard"; // Import your admin components
import Appointments from "../Appointments"; // Other admin components
import Users from "../Users"; // Other admin components
import Roles from "../Roles";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Redirect from "/admin" to "/admin/dashboard" */}
        <Route path="/" element={<Navigate replace to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
