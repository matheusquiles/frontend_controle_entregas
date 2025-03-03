import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  const { user, loading } = useUser();

  if (loading) {
    return <div>Carregando...</div>; // Pode substituir por um spinner
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
