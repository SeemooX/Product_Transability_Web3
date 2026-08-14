import { ScanLine, Home, Package, Clock3, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export const NavBar = () => {
    const { pathname } = useLocation();

    return (
        <>
            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full h-20 bg-white border-t flex justify-around items-center">

                <Link to="/home" className={`flex flex-col items-center ${pathname === "/home"
                    ? "text-black"
                    : "text-gray-500"
                    }`}>
                    <Home size={20} />
                    <span className="text-xs mt-1">Accueil</span>
                </Link>

                <Link to="/products" className={`flex flex-col items-center ${pathname === "/products"
                    ? "text-black"
                    : "text-gray-500"
                    }`}>
                    <Package size={20} />
                    <span className="text-xs mt-1 font-medium">Produits</span>
                </Link>

                <Link to="/scan" className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center -mt-8 shadow-xl">
                    <ScanLine size={28} className="text-white" />
                </Link>

                <Link to="/history" className={`flex flex-col items-center ${pathname === "/history"
                    ? "text-black"
                    : "text-gray-500"
                    }`}>
                    <Clock3 size={20} />
                    <span className="text-xs mt-1">Historique</span>
                </Link>

                <Link to="/profile" className={`flex flex-col items-center ${pathname === "/profile"
                        ? "text-black"
                        : "text-gray-500"
                    }`}>
                    <User size={20} />
                    <span className="text-xs mt-1">Profil</span>
                </Link>

            </nav>
        </>
    )
}