import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, hasRole, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-lg">Cargando...</div>
    </div>;
  }

  // Si no hay usuario logueado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificarlo
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/home" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
