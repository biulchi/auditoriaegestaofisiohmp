import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // If trying to access audit or physio and not admin, redirect to timesheet
  if (
    (location.pathname === "/audit" || location.pathname === "/physio") &&
    userRole !== "admin"
  ) {
    return <Navigate to="/timesheet" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
