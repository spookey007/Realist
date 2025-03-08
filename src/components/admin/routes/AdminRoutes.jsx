// src/components/admin/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import Dashboard from "../Dashboard";
import Appointments from "../Appointments";
import Users from "../Users";
import Roles from "../Roles";
import Invites from "../Invites";
import MenuManagement from "../MenuManagement";

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
        <Route path="invites" element={<Invites />} />
        <Route path="menu" element={<MenuManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
