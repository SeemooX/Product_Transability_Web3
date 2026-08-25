import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  Fingerprint,
  Smartphone,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export const SecurityPage = () => {
  const navigate = useNavigate();

  const securityItems = [
    {
      icon: KeyRound,
      label: "Changer le mot de passe",
      description: "Modifier le mot de passe de votre compte",
      path: "/users/me/security/password",
    },
    {
      icon: LockKeyhole,
      label: "Code PIN",
      description: "Gérer votre code PIN",
      path: "/users/me/security/pin",
    },
    {
      icon: Fingerprint,
      label: "Authentification biométrique",
      description: "Utiliser votre empreinte ou Face ID",
      path: "/users/me/security/biometric",
    },
    {
      icon: Smartphone,
      label: "Appareils connectés",
      description: "Gérer les appareils associés à votre compte",
      path: "/users/me/security/devices",
    },
  ];

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-green-600 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-14 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 active:scale-95 transition"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Sécurité
            </h1>

            <p className="mt-1 text-sm text-green-100">
              Protégez votre compte
            </p>
          </div>
        </div>
      </header>

      {/* White Sheet */}
      <main className="flex-1 -mt-8 overflow-y-auto rounded-t-[34px] bg-white px-6 pt-8 pb-10">
        {/* Intro */}
        <div className="mb-7 flex items-center gap-4 rounded-2xl bg-green-50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <ShieldCheck
              size={23}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Votre compte est protégé
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Gérez les paramètres de sécurité de votre compte.
            </p>
          </div>
        </div>

        {/* Security */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Sécurité du compte
          </h2>

          <div className="divide-y divide-gray-100">
            {securityItems.map(
              ({ icon: Icon, label, description, path }) => (
                <Link
                  to={path}
                  key={label}
                  className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <Icon
                        size={20}
                        className="text-gray-700"
                      />
                    </div>

                    <div className="min-w-0">
                      <span className="block font-medium text-gray-800">
                        {label}
                      </span>

                      <span className="mt-1 block text-sm text-gray-400">
                        {description}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className="ml-3 shrink-0 text-gray-400"
                  />
                </Link>
              )
            )}
          </div>
        </section>

        {/* Additional security */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recommandations
          </h2>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm leading-6 text-gray-600">
              Utilisez un mot de passe unique et activez les
              options de sécurité disponibles pour mieux protéger
              votre compte.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};