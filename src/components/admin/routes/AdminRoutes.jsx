import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import AdminLayout from "../AdminLayout";
import Dashboard from "../Dashboard";
import Appointments from "../Appointments";
import Users from "../Users";
import Roles from "../Roles";
import Invites from "../Invites";
import MenuManagement from "../MenuManagement";
import Listings from "../Listings";

const AdminRoutes = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="invite" element={<Invites />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="listings" element={<Listings />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
