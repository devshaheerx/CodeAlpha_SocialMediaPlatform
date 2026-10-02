import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader full />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Keeps logged-in users away from login/register
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader full />;
  if (user) return <Navigate to="/" replace />;
  return children;
}
