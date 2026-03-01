import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Protects routes based on authentication and optional allowed roles
const ProtectedRoute = ({ auth, allowedRoles }) => {
  const { user } = auth;

  // Not logged in -> go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection and chexcking
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const target = user.role === "ADMIN" ? "/admin" : "/client";
    return <Navigate to={target} replace />;
  }

  // Allowed -> render nested route
  return <Outlet />;
};

export default ProtectedRoute;

