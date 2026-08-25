import {
    ArrowLeft,
    ChevronRight,
    CircleHelp,
    LockKeyhole,
    Search,
    User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export const HelpPage = () => {
    const navigate = useNavigate();

    const categories = [
        {
            icon: User,
            label: "Compte",
            description: "Profil, informations et paramètres",
            path: "/users/me/help/account",
        },
        {
            icon: LockKeyhole,
            label: "Sécurité",
            description: "Mot de passe et accès au compte",
            path: "/users/me/help/security",
        }
    ];

    const faq = [
        {
            question: "Comment modifier mes informations personnelles ?",
            path: "/users/me/help/profile",
        },
        {
            question: "J'ai oublié mon mot de passe",
            path: "/users/me/help/forgot-password",
        }
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
                            Centre d'aide
                        </h1>

                        <p className="mt-1 text-sm text-green-100">
                            Comment pouvons-nous vous aider ?
                        </p>
                    </div>
                </div>
            </header>

            {/* White Sheet */}
            <main className="flex-1 -mt-8 overflow-y-auto rounded-t-[34px] bg-white px-6 pt-8 pb-10">
                {/* Search */}
                <div className="relative mb-8">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Rechercher une question..."
                        className="h-14 w-full rounded-2xl bg-gray-100 pl-12 pr-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* FAQ */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Questions fréquentes
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {faq.map(({ question, path }) => (
                            <Link
                                key={question}
                                to={path}
                                className="flex items-center justify-between py-4 active:scale-[0.98] transition"
                            >
                                <span className="pr-4 font-medium leading-5 text-gray-800">
                                    {question}
                                </span>

                                <ChevronRight
                                    size={18}
                                    className="shrink-0 text-gray-400"
                                />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Catégories
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {categories.map(
                            ({ icon: Icon, label, description, path }) => (
                                <Link
                                    key={label}
                                    to={path}
                                    className="flex items-center justify-between py-4 active:scale-[0.98] transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                            <Icon
                                                size={20}
                                                className="text-gray-700"
                                            />
                                        </div>

                                        <div>
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
                                        className="text-gray-400"
                                    />
                                </Link>
                            )
                        )}
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="mt-8">
                    <div className="rounded-2xl bg-green-50 p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                                <CircleHelp
                                    size={21}
                                    className="text-green-600"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Vous ne trouvez pas votre réponse ?
                                </h3>

                                <p className="mt-1 text-sm leading-5 text-gray-500">
                                    Notre équipe est disponible pour vous aider.
                                </p>

                                <Link
                                    to="/users/me/contactUs"
                                    className="mt-3 inline-block font-semibold text-green-600"
                                >
                                    Contacter le support
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};