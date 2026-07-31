import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { createUser } from "@/api/authenticationApi";
import { useNavigate } from "react-router";
import type { UserForm } from "@/types/userForm";

export default function CreateUser() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState<UserForm>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "FABRICANT",
        walletAddress: "",
        companyName: "",
    });

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

            alert(data.success);

            navigate("/home");
        } catch (error: any) {
            console.error(error);

            alert(error.message || "Registration failed");
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
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                            >
                                <option value="FABRICANT">Fabricant</option>
                                <option value="TRANSPORTEUR">Transporteur</option>
                                <option value="ENTREPOT">Entrepôt</option>
                                <option value="DISTRIBUTEUR">Distributeur</option>
                                <option value="CLIENT">Client</option>
                            </select>
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
        </div>
    );
}