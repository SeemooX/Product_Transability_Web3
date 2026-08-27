import { useState } from "react";
import { ArrowLeft, Building2, Check, CheckCircle2, Mail, User, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestAccount } from "@/api/userApi";

type UserRole =
  | "MANUFACTURER"
  | "TRANSPORTER"
  | "WAREHOUSE"
  | "STORE";

export const ProfileRequestPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [walletAddress, setWalletAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!role) return;

    try {
      setIsSubmitting(true);

      let formData = {
        fullName: fullName,
        email: email,
        role: role,
        walletAddress: walletAddress,
        companyName: companyName.trim()
      }

      const result = await requestAccount(formData);
      if (result) {
        setShowSuccess(true);
      }
    } catch (error: any) {
      console.error(
        "Failed to request profile creation:",
        error
      );
      setErrorMessage(
        error?.message ||
        "Une erreur est survenue lors de la demande."
      );
      setShowFailure(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    role !== "" &&
    walletAddress.trim() !== "";

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-green-600">
      {/* Header */}
      <header className="px-6 pb-14 pt-12 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition active:scale-95"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Créer mon profil
            </h1>

            <p className="mt-1 text-sm text-green-100">
              Demandez l'accès à votre espace professionnel
            </p>
          </div>
        </div>
      </header>

      {/* White Sheet */}
      <main className="-mt-8 flex-1 overflow-y-auto rounded-t-[34px] bg-white px-6 pb-10 pt-8">
        {/* Intro */}
        <div className="mb-8 rounded-2xl bg-green-50 p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Demande de création de profil
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Renseignez vos informations. Votre demande
                sera vérifiée et traitée par un administrateur.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal information */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>

            <div className="space-y-5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Prénom et nom
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Votre prénom et nom"
                    autoComplete="name"
                    className="h-14 w-full rounded-2xl border-0 bg-gray-100 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Adresse email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    className="h-14 w-full rounded-2xl border-0 bg-gray-100 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Professional information */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Informations professionnelles
            </h2>

            <div className="space-y-5">
              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Type de profil
                </label>

                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as UserRole)
                  }
                >
                  <SelectTrigger
                    className="
                      h-14 w-full
                      rounded-2xl
                      border-0
                      bg-gray-100
                      px-4
                      text-sm
                      text-gray-800
                      shadow-none
                      focus:ring-2
                      focus:ring-green-500
                      focus:ring-offset-0
                      data-[placeholder]:text-gray-400
                    "
                  >
                    <SelectValue placeholder="Sélectionner votre activité" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl border-gray-100 bg-white p-2 shadow-xl">
                    <SelectItem
                      value="MANUFACTURER"
                      className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700"
                    >
                      Fabricant
                    </SelectItem>

                    <SelectItem
                      value="TRANSPORTER"
                      className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700"
                    >
                      Transporteur
                    </SelectItem>

                    <SelectItem
                      value="WAREHOUSE"
                      className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700"
                    >
                      Entrepôt
                    </SelectItem>

                    <SelectItem
                      value="STORE"
                      className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700"
                    >
                      Magasin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Nom de l'entreprise
                  <span className="ml-1 font-normal text-gray-400">
                    (optionnel)
                  </span>
                </label>

                <div className="relative">
                  <Building2
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    placeholder="Nom de votre entreprise"
                    autoComplete="organization"
                    className="h-14 w-full rounded-2xl border-0 bg-gray-100 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Wallet */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Portefeuille
            </h2>

            <div>
              <label
                htmlFor="walletAddress"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Adresse du portefeuille
              </label>

              <div className="relative">
                <Wallet
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="walletAddress"
                  type="text"
                  value={walletAddress}
                  onChange={(e) =>
                    setWalletAddress(e.target.value)
                  }
                  placeholder="0x..."
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={42}
                  className="h-14 w-full rounded-2xl border-0 bg-gray-100 pl-12 pr-4 font-mono text-sm text-gray-800 outline-none transition placeholder:font-sans placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Utilisez l'adresse de votre portefeuille
                compatible avec votre plateforme.
              </p>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-green-600 px-6 font-semibold text-white shadow-sm shadow-green-600/20 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                <span>
                  Envoi en cours...
                </span>
              </div>
            ) : (
              "Envoyer ma demande"
            )}
          </button>

          {/* Footer note */}
          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            En envoyant cette demande, vous acceptez que vos
            informations soient vérifiées par l'administrateur.
          </p>
        </form>
      </main>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">

          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">

            {/* Success icon */}

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check
                size={32}
                className="text-green-600"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Demande envoyée avec succès
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              La Demande a été envoyée avec succès
              dans le système.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
              }}
              className="mt-6 w-full rounded-2xl bg-green-600 py-3.5 font-semibold text-white transition active:scale-95"
            >
              Continuer
            </button>

          </div>

        </div>
      )}

      {showFailure && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-5">

          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">

            {/* Failure icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <X
                size={32}
                className="text-red-600"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Échec de la demande
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setShowFailure(false)}
              className="mt-6 w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white transition active:scale-95"
            >
              Fermer
            </button>

          </div>

        </div>
      )}
    </div>
  );
};