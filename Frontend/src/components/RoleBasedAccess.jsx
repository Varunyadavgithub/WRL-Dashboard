import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedAccess = ({ element: Component, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;

  // Allow admin to access everything
  if (user.role === "admin" || allowedRoles.includes(user.role)) {
    return Component;
  }

  return <Navigate to="/not-authorized" replace />;
};

export default RoleBasedAccess;
