import { Users, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export const AdminNavBar = () => {
    const { pathname } = useLocation();

    return (
        <nav className="fixed bottom-0 left-1/2 z-50 flex h-20 w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-gray-100 bg-white px-12">
            
            <Link
                to="/userRequests"
                className={`flex flex-col items-center transition-colors ${
                    pathname === "/userRequests"
                        ? "text-black"
                        : "text-gray-400"
                }`}
            >
                <Users size={21} />
                <span className="mt-1 text-xs font-medium">
                    Utilisateurs
                </span>
            </Link>

            <Link
                to="/profile"
                className={`flex flex-col items-center transition-colors ${
                    pathname === "/profile"
                        ? "text-black"
                        : "text-gray-400"
                }`}
            >
                <User size={21} />
                <span className="mt-1 text-xs font-medium">
                    Profil
                </span>
            </Link>

        </nav>
    );
};