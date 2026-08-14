import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }: any) => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (role.toLowerCase() === "admin") {
    return <Navigate to="/createUser" />;
  }

  return children;
};