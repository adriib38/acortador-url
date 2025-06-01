import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("Usuario no autenticado, redirigiendo a login");
    <Navigate to="/login" replace />;
  }
 
  return children;
};

export default PrivateRoute;
