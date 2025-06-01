import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    console.log("Autenticado, redirigiendo a la página principal");
    return <Navigate to="/" replace />;
  }
 
  return <Navigate to="/login" replace />;
};

export default PublicRoute;
