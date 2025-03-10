import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  console.log("ProtectedRoute: authToken =", authToken); // Debugging log

  if (!authToken) {
    console.log("Redirecting to login");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
