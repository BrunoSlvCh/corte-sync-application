import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, auth } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!auth.isAdmin) {
    return <Navigate to="/inicio" replace />;
  }
  return children;
}

export function BarberRoute({ children }) {
  const { isAuthenticated, auth } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login-barbeiro" state={{ from: location }} replace />;
  }
  if (!auth.isBarbeiro && !auth.isAdmin) {
    return <Navigate to="/inicio" replace />;
  }
  return children;
}
