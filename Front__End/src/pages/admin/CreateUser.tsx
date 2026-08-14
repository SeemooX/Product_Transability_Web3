import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, UserPlus, X } from "lucide-react";
import { createUser } from "@/api/authenticationApi";
/* import { useNavigate } from "react-router"; */
import type { UserForm } from "@/types/userForm";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/types/roles";

export default function CreateUser() {
    /* const navigate = useNavigate(); */
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createdUser, setCreatedUser] = useState<{
        fullName: string;
        email: string;
    } | null>(null);

    const [form, setForm] = useState<UserForm>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "MANUFACTURER",
        walletAddress: "",
        companyName: "",
    });

    const roleLabels: Record<Role, string> = {
        MANUFACTURER: "Fabricant",
        TRANSPORTEUR: "Transporteur",
        ADMIN: "Administrateur",
        WAREHOUSE: "Entrepôt",
        STORE: "Magasin",
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const data = await createUser(form);
            if (data) {
                setCreatedUser(data.user);
                setShowSuccess(true);
            }

            /* navigate("/home"); */
        } catch (error: any) {
            console.error(error);
            setErrorMessage(
                error?.message ||
                "Une erreur est survenue lors de la création de l'utilisateur."
            );
            setShowFailure(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col">
            <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <button type="button">
                        <ArrowLeft size={22} />
                    </button>

                    <h1 className="text-lg font-semibold">Créer un utilisateur</h1>

                    <div className="w-6" />
                </div>
            </header>

            <main className="flex-1 px-5 py-6 overflow-y-auto pb-10">
                <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                        <UserPlus size={26} className="text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold">Nouvel utilisateur</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Renseignez les informations du nouvel utilisateur.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg">Informations utilisateur</h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">Nom complet</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Jean Dupont"
                                maxLength={100}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Adresse email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="jean.dupont@example.com"
                                maxLength={255}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Rôle</label>
                            <Select
                                value={form.role}
                                onValueChange={(value) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        role: value as Role,
                                    }));
                                }}
                            >
                                <SelectTrigger className="w-full h-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-0 focus:ring-offset-0 font-normal text-gray-900">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                </SelectTrigger>

                                <SelectContent className="rounded-xl border border-gray-200 bg-white">
                                    {Object.entries(roleLabels).map(([role, label]) => (
                                        <SelectItem key={role} value={role} className="px-4 py-3 cursor-pointer rounded-lg focus:bg-green-50 focus:text-green-700">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Entreprise</label>
                            <input
                                type="text"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                placeholder="Bosch Allemagne"
                                maxLength={120}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Adresse du wallet
                            </label>
                            <input
                                type="text"
                                name="walletAddress"
                                value={form.walletAddress}
                                onChange={handleChange}
                                placeholder="0x..."
                                maxLength={42}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Adresse Ethereum de l'utilisateur
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Mot de passe</h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:border-green-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Confirmé Mot de passe</h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confirmé Mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-4 rounded-2xl shadow-sm active:scale-[0.98] transition"
                    >
                        Créer l'utilisateur
                    </button>
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
                            Utilisateur {createdUser?.fullName} ajouté avec succès
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            La creation de l'utilisateur  {createdUser?.fullName} a été enregistré avec succès
                            dans le système.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
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
                            Échec de la creation
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
}