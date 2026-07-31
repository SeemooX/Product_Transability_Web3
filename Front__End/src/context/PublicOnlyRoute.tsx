import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export const PublicOnlyRoute = ({ children }: any) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};