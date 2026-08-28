import { getUser } from "@/api/userApi";
import { AdminNavBar } from "@/components/AdminNavBar";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import type { UserData } from "@/types/userForm";
import {
  User,
  Shield,
  Settings,
  CircleHelp,
  Mail,
  LogOut,
  ChevronRight,
  UserRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData>();
  const { logout, role } = useAuth();

  useEffect(() => {
    const bringedUser = async () => {
      try {
        const data = await getUser();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    }

    bringedUser();
  }, [])

  const accountItems = [
    { icon: User, label: "Informations personnelles", path: "/users/me" },
    { icon: Shield, label: "Sécurité", path: "/security" },
    { icon: Settings, label: "Préférences", path: "/preference" },
  ];

  const supportItems = [
    { icon: CircleHelp, label: "Centre d'aide", path: "/help" },
    { icon: Mail, label: "Nous contacter", path: "/contactUs" },
  ];

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-green-600 flex flex-col">

      {/* Header */}
      <header className="px-6 pt-12 pb-14 text-white">

        <div className="flex items-center gap-4">

          <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white p-1 shadow-md">
            {!userData ? (
              /* Loading */
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-green-500" />
              </div>
            ) : userData.imageUrl ? (
              /* Avatar */
              <img
                src={userData.imageUrl}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              /* Default profile icon */
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <UserRound
                  className="h-8 w-8 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {userData?.fullName}
            </h1>

            <p className="mt-1 text-green-100">
              {userData?.role}
            </p>
          </div>

        </div>

      </header>

      {/* White Sheet */}
      <main className="flex-1 -mt-8 overflow-y-auto rounded-t-[34px] bg-white px-6 pt-8 pb-28">

        {/* Account */}
        <section>

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Mon compte
          </h2>

          <div className="divide-y divide-gray-100">

            {accountItems.map(({ icon: Icon, label, path }, index) => (
              <Link
                to={path}
                key={index}
                className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={20} className="text-gray-700" />
                  </div>

                  <span className="font-medium text-gray-800">
                    {label}
                  </span>
                </div>

                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            ))}

          </div>

        </section>

        {/* Support */}
        <section className="mt-8">

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Support
          </h2>

          <div className="divide-y divide-gray-100">

            {supportItems.map(({ icon: Icon, label, path }, index) => (
              <Link
                to={path}
                key={index}
                className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={20} className="text-gray-700" />
                  </div>

                  <span className="font-medium text-gray-800">
                    {label}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />

              </Link>
            ))}

          </div>

        </section>

        {/* Logout */}
        <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 font-semibold text-red-600 transition active:scale-[0.98]" onClick={() => logout()}>
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>

      </main>

      {role.toLowerCase() === "admin" ? <AdminNavBar /> : <NavBar />}

    </div>
  );
}