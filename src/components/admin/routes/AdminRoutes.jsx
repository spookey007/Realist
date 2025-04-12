import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import GuestForm from "../GuestForm"; // Guest form for updating user menu/role
import Dashboard from "../Dashboard";
import Appointments from "../Appointments";
import Users from "../Users";
import Roles from "../Roles";
import Invites from "../Invites";
import MenuManagement from "../MenuManagement";
import Services from "../Services";
import ServiceTypes from "../ServiceTypes";
import Listings from "../Listings";
import Reports from "../Reports";
import UserPrivileges from "../UserPrivileges";

import ProtectedRoute from "../ProtectedRoute";
import AdminLayout from "../AdminLayout";

const AdminRoutes = () => {
  const { user, menu } = useAuth(); // Get user and menu from context or API response

  // Check if the user has no menu rights and role is 0 (guest)
  // if (user && Array.isArray(menu) && menu.length === 0 && user.role === 0) {
  //   // If menu is empty and the role is 0 (guest), show the GuestForm
  //   return <GuestForm />;
  // }

  // Check if user has menu rights to access specific routes
  const hasPermission = (menuItem) => {
    return menu && menu.some((item) => item.href === menuItem);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate replace to="dashboard" />} />
        <Route
          path="dashboard"
          element={hasPermission("/dashboard") ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="appointments"
          element={hasPermission("/appointments") ? <Appointments /> : <Navigate to="/" />}
        />
        <Route
          path="users"
          element={hasPermission("/users") ? <Users /> : <Navigate to="/" />}
        />
        <Route
          path="roles"
          element={hasPermission("/roles") ? <Roles /> : <Navigate to="/" />}
        />
        <Route
          path="invite"
          element={hasPermission("/invite") ? <Invites /> : <Navigate to="/" />}
        />
        <Route
          path="menu"
          element={hasPermission("/menu") ? <MenuManagement /> : <Navigate to="/" />}
        />
        <Route
          path="listings"
          element={hasPermission("/listings") ? <Listings /> : <Navigate to="/" />}
        />
        <Route
          path="services"
          element={hasPermission("/services") ? <Services /> : <Navigate to="/" />}
        />
        <Route
          path="servicetype"
          element={hasPermission("/servicetype") ? <ServiceTypes /> : <Navigate to="/" />}
        />
        <Route
          path="reports"
          element={hasPermission("/reports") ? <Reports /> : <Navigate to="/" />}
        />
        <Route
          path="userprivileges"
          element={hasPermission("/userprivileges") ? <UserPrivileges /> : <Navigate to="/" />}
        />
    </Routes>
    </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
