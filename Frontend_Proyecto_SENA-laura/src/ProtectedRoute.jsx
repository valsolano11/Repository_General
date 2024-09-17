import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LinearProgress from "@mui/material/LinearProgress";

const ProtectedRoute = ({ requiredRoleId }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div>
        <LinearProgress className="h-2 w-full mt-2" color="primary" />
      </div>
    );
  }

  // Redirige a /homecoord si el usuario tiene RolId 2
  if (user?.RolId === 2 && requiredRoleId !== 2) {
    return <Navigate to="/homecoord" replace />;
  }

  if (!isAuthenticated || (requiredRoleId && user?.RolId !== requiredRoleId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
