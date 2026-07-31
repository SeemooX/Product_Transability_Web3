import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export const AdminRoute = ({ children }: any) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (role.toLowerCase() !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};