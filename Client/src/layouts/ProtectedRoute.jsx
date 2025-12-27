// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children}) => {
  const { token } = useSelector((state) => state.auth); // assuming auth state is in Redux

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

//   // role check
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // ngoExist check
//   if (requireNgoExist && !user.ngoExist) {
//     return <Navigate to="/auth/ngo-verification" replace />;
//   }

  return children;
};

export default ProtectedRoute;
