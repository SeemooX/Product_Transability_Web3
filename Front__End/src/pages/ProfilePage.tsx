import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Shield,
  Settings,
  CircleHelp,
  Mail,
  LogOut,
  ChevronRight
} from "lucide-react";

export const ProfilePage = () => {
  const { logout } = useAuth();

  const accountItems = [
    { icon: User, label: "Informations personnelles" },
    { icon: Shield, label: "Sécurité" },
    { icon: Settings, label: "Préférences" },
  ];

  const supportItems = [
    { icon: CircleHelp, label: "Centre d'aide" },
    { icon: Mail, label: "Nous contacter" },
  ];

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-green-600 flex flex-col">

      {/* Header */}
      <header className="px-6 pt-12 pb-14 text-white">

        <div className="flex items-center gap-4">

          <div className="rounded-full bg-white p-1 shadow-md">
            <img
              src="/images/avatar.png"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Jean Dupont
            </h1>

            <p className="mt-1 text-green-100">
              Fabricant
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

            {accountItems.map(({ icon: Icon, label }, index) => (
              <button
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

              </button>
            ))}

          </div>

        </section>

        {/* Support */}
        <section className="mt-8">

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Support
          </h2>

          <div className="divide-y divide-gray-100">

            {supportItems.map(({ icon: Icon, label }, index) => (
              <button
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

              </button>
            ))}

          </div>

        </section>

        {/* Logout */}
        <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 font-semibold text-red-600 transition active:scale-[0.98]" onClick={() => logout()}>
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>

      </main>

      <NavBar />

    </div>
  );
}