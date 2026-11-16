import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("mobilix_token");
  const storedAdmin = localStorage.getItem("mobilix_admin");

  let isAdmin = false;
  if (token && storedAdmin) {
    try {
      const admin = JSON.parse(storedAdmin);
      if (admin && (admin.role === "ADMIN" || admin.role === "admin")) {
        isAdmin = true;
      }
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    return (
      <Navigate to="/admin/portal/auth" state={{ from: location }} replace />
    );
  }

  return children;
}

export default ProtectedAdminRoute;
