import { useEffect, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff, Lock, Mail, Plus, User, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router";
import { acceptAccount, rejectAccount, retrieveAccounts } from "@/api/adminApi";
import { NavBar } from "@/components/NavBar";

/* type UserRequest = {
    id: string;
    fullName: string;
    email: string;
    imageUrl?: string;
}; */

/* const pendingUsers: UserRequest[] = [
    {
        id: "1",
        fullName: "Ahmed Benali",
        email: "ahmed@example.com",
        imageUrl: "/images/avatar.png",
    },
    {
        id: "2",
        fullName: "Sarah Martin",
        email: "sarah@example.com",
        imageUrl: "/images/avatar.png",
    },
]; */

export default function AccountRequests() {
    const [accounts, setAccounts] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [passwords, setPasswords] = useState<Record<string, { password: string; confirmPassword: string }>>({});
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const [showConfirmPassword, setShowConfirmPassword] = useState<Record<string, boolean>>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSuccessReject, setShowSuccessReject] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const [showFailureReject, setShowFailureReject] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageReject, setErrorMessageReject] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const bringeAccounts = async () => {
            try {
                setLoading(true);

                const bringedAccounts = await retrieveAccounts();
                if (bringedAccounts) {
                    setAccounts(bringedAccounts);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        bringeAccounts();
    }, [showSuccess, showSuccessReject]);

    const handleAccept = (userId: string) => {
        setExpandedUser((current) =>
            current === userId ? null : userId
        );
    };

    const handleReject = async (userId: string) => {
        try {
            const result = await rejectAccount(userId);
            if (result) {
                setShowSuccessReject(true);
            }

            setAccounts((current: any) =>
                current.filter((user: any) => user.id !== userId)
            );
        } catch (error: any) {
            console.error("Reject account error:", error);
             setErrorMessageReject(
                error?.message ||
                "Une erreur est survenue lors de le refus de l'utilisateur."
            );
            setShowFailureReject(true);
        }
    };

    const handleSend = async (userId: string) => {
        const data = passwords[userId];

        if (!data?.password || !data?.confirmPassword) {
            return;
        }

        if (data.password !== data.confirmPassword) {
            return;
        }

        try {
            const result = await acceptAccount(userId, {password: data.password});
            if (result) {
                setShowSuccess(true);
            }

            setAccounts((current: any) =>
                current.filter((user: any) => user.id !== userId)
            );

            setExpandedUser(null);
        } catch (error: any) {
            console.error("Accept account error:", error);
            setErrorMessage(
                error?.message ||
                "Une erreur est survenue lors de la création de l'utilisateur."
            );
            setShowFailure(true);
        }
    };

    const updatePassword = (
        userId: string,
        field: "password" | "confirmPassword",
        value: string
    ) => {
        setPasswords((current) => ({
            ...current,
            [userId]: {
                ...current[userId],
                [field]: value,
            },
        }));
    };

    if (loading && accounts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">
                    <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                    <p className="mt-5 text-gray-700 font-medium">
                        Chargement des demandes...
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Veuillez patienter
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white px-5 pb-5 pt-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                            <User className="h-5 w-5 text-green-600" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-semibold text-gray-900">
                                Demandes de comptes
                            </h1>

                            <p className="mt-1 text-xs text-gray-400">
                                Gérez les demandes de création de compte
                            </p>
                        </div>
                    </div>

                    {/* Create user */}
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/createuser");
                        }}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 active:bg-green-800"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Créer</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="px-4 pb-8 pt-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-800">
                        Demandes en attente
                    </h2>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                        {accounts.length}
                    </span>
                </div>

                <div className="space-y-4">
                    {accounts.length === 0 ? (
                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 text-center shadow-sm">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                Aucune demande en attente
                            </h3>

                            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-400">
                                Il n'y a actuellement aucune demande de création
                                de compte à traiter.
                            </p>
                        </div>
                    ) : (accounts.map((user: any) => {
                        const isExpanded = expandedUser === user.idRequest;
                        const userPassword = passwords[user.idRequest];

                        return (
                            <div
                                key={user.idRequest}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                            >
                                {/* User */}
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-green-100">
                                                <UserRound className="h-7 w-7 text-green-600" />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-gray-900">
                                                {user.fullName}
                                            </h3>

                                            <div className="mt-1 flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                                                <p className="truncate text-xs text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {!isExpanded && (
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleReject(user.idRequest)}
                                                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
                                            >
                                                <X className="h-4 w-4" />
                                                Refuser
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleAccept(user.idRequest)}
                                                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                                            >
                                                <Check className="h-4 w-4" />
                                                Accepter
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Password form */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/70 p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    Créer le compte
                                                </h4>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Définissez le mot de passe de cet utilisateur.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setExpandedUser(null)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-400 hover:bg-gray-100"
                                                aria-label="Fermer"
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Password */}
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">
                                                    Mot de passe
                                                </label>

                                                <div className="relative mt-2">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                                    <input
                                                        type={
                                                            showPassword[user.idRequest]
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={userPassword?.password || ""}
                                                        onChange={(e) =>
                                                            updatePassword(
                                                                user.idRequest,
                                                                "password",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Mot de passe"
                                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword((current) => ({
                                                                ...current,
                                                                [user.idRequest]: !current[user.idRequest],
                                                            }))
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                    >
                                                        {showPassword[user.idRequest] ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm password */}
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">
                                                    Confirmer le mot de passe
                                                </label>

                                                <div className="relative mt-2">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                                    <input
                                                        type={
                                                            showConfirmPassword[user.idRequest]
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={userPassword?.confirmPassword || ""}
                                                        onChange={(e) =>
                                                            updatePassword(
                                                                user.idRequest,
                                                                "confirmPassword",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Confirmer le mot de passe"
                                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword((current) => ({
                                                                ...current,
                                                                [user.idRequest]: !current[user.idRequest],
                                                            }))
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                    >
                                                        {showConfirmPassword[user.idRequest] ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Send */}
                                            <button
                                                type="button"
                                                onClick={() => handleSend(user.idRequest)}
                                                disabled={
                                                    !userPassword?.password ||
                                                    !userPassword?.confirmPassword ||
                                                    userPassword.password !==
                                                    userPassword.confirmPassword
                                                }
                                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                                            >
                                                <Check className="h-4 w-4" />
                                                Créer le compte
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </div>
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
                            Utilisateur  accepté avec succès
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            La creation de l'utilisateur a été enregistré avec succès
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

            {showSuccessReject && (
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
                            Utilisateur  refusé avec succès
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Le refus de l'utilisateur a été enregistré avec succès
                            dans le système.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowSuccessReject(false)}
                            className="mt-6 w-full rounded-2xl bg-green-600 py-3.5 font-semibold text-white transition active:scale-95"
                        >
                            Continuer
                        </button>

                    </div>

                </div>
            )}

            {showFailureReject && (
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
                            Échec de refus
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {errorMessageReject}
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowFailureReject(false)}
                            className="mt-6 w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white transition active:scale-95"
                        >
                            Fermer
                        </button>

                    </div>

                </div>
            )}
            {/* <NavBar/> */}
        </div>
    );
}