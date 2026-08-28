import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export const SharedProtectedRoute = ({ children }: any) => {
  const { isLoggedIn } = useAuth();
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

  return children;
};