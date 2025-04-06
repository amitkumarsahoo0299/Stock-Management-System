import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;