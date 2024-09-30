import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LinearProgress from "@mui/material/LinearProgress";

// const ProtectedRoute = ({ requiredRoleId, requiredPermission }) => {
//   const { isAuthenticated, loading, user } = useAuth();

//   if (loading) {
//     return (
//       <div>
//         <LinearProgress className="h-2 w-full mt-2" color="primary" />
//       </div>
//     );
//   }

//   // Si el usuario no está autenticado
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // Redirige a /homecoord si el usuario tiene RolId 2
//   if (user?.RolId === 2 && requiredRoleId !== 2) {
//     return <Navigate to="/homecoord" replace />;
//   }

//   if (requiredRoleId && user?.RolId !== requiredRoleId) {
//     return <Navigate to="/" replace />;
//   }

//   if (!isAuthenticated || (requiredRoleId && user?.RolId !== requiredRoleId)) {
//     return <Navigate to="/" replace />;
//   }

//   // Verificación de permiso
//   if (
//     requiredPermission &&
//     !user.DetallePermisos.some((permiso) => permiso.Permiso.nombrePermiso === requiredPermission)
//   ) {
//     return <Navigate to="/no-permission" replace />;
//   }

//   return <Outlet />;
// };

const ProtectedRoute = ({ requiredRoleId, requiredPermission }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div>
        <LinearProgress className="h-2 w-full mt-2" color="primary" />
      </div>
    );
  }

  // Redirigir si el usuario no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Verificar el RolId, si se requiere un rol específico
  if (requiredRoleId && user?.RolId !== requiredRoleId) {
    return <Navigate to="/no-permission" replace />;
  }

  // Verificar permisos, si se requiere un permiso específico
  if (requiredPermission && !user?.DetallePermisos.some(p => p.Permiso.nombrePermiso === requiredPermission)) {
    return <Navigate to="/no-permission" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
