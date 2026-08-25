import {
    ArrowLeft,
    Bell,
    ChevronRight,
    Globe,
    Moon,
    Volume2,
    Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export const PreferencePage = () => {
    const [notifications, setNotifications] = useState(true);
    const [sounds, setSounds] = useState(true);
    const [vibration, setVibration] = useState(true);

    const navigate = useNavigate();

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
                            Préférences
                        </h1>

                        <p className="mt-1 text-sm text-green-100">
                            Personnalisez votre expérience
                        </p>
                    </div>
                </div>
            </header>

            {/* White Sheet */}
            <main className="flex-1 -mt-8 overflow-y-auto rounded-t-[34px] bg-white px-6 pt-8 pb-10">
                {/* Notifications */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Notifications
                    </h2>

                    <div className="divide-y divide-gray-100">
                        <PreferenceSwitch
                            icon={Bell}
                            label="Notifications"
                            description="Recevoir les notifications de l'application"
                            enabled={notifications}
                            onChange={() => setNotifications(!notifications)}
                        />

                        <PreferenceSwitch
                            icon={Volume2}
                            label="Sons"
                            description="Activer les sons de l'application"
                            enabled={sounds}
                            onChange={() => setSounds(!sounds)}
                        />

                        <PreferenceSwitch
                            icon={Volume2}
                            label="Vibrations"
                            description="Activer les vibrations"
                            enabled={vibration}
                            onChange={() => setVibration(!vibration)}
                        />
                    </div>
                </section>

                {/* Appearance */}
                <section className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Apparence
                    </h2>

                    <div className="divide-y divide-gray-100">
                        <Link
                            to="/users/me/preference/language"
                            className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                    <Globe
                                        size={20}
                                        className="text-gray-700"
                                    />
                                </div>

                                <div>
                                    <span className="block font-medium text-gray-800">
                                        Langue
                                    </span>

                                    <span className="mt-1 block text-sm text-gray-400">
                                        Français
                                    </span>
                                </div>
                            </div>

                            <ChevronRight
                                size={18}
                                className="text-gray-400"
                            />
                        </Link>

                        <Link
                            to="/users/me/preference/theme"
                            className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                    <Moon
                                        size={20}
                                        className="text-gray-700"
                                    />
                                </div>

                                <div>
                                    <span className="block font-medium text-gray-800">
                                        Thème
                                    </span>

                                    <span className="mt-1 block text-sm text-gray-400">
                                        Automatique
                                    </span>
                                </div>
                            </div>

                            <ChevronRight
                                size={18}
                                className="text-gray-400"
                            />
                        </Link>
                    </div>
                </section>

                {/* Privacy */}
                <section className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Confidentialité
                    </h2>

                    <Link
                        to="/users/me/preference/privacy"
                        className="flex w-full items-center justify-between py-4 active:scale-[0.98] transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                <Shield
                                    size={20}
                                    className="text-gray-700"
                                />
                            </div>

                            <div>
                                <span className="block font-medium text-gray-800">
                                    Confidentialité
                                </span>

                                <span className="mt-1 block text-sm text-gray-400">
                                    Gérez vos paramètres de confidentialité
                                </span>
                            </div>
                        </div>

                        <ChevronRight
                            size={18}
                            className="text-gray-400"
                        />
                    </Link>
                </section>
            </main>
        </div>
    );
};

type PreferenceSwitchProps = {
    icon: React.ElementType;
    label: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
};

const PreferenceSwitch = ({
    icon: Icon,
    label,
    description,
    enabled,
    onChange,
}: PreferenceSwitchProps) => {
    return (
        <button
            onClick={onChange}
            className="flex w-full items-center justify-between py-4 text-left active:scale-[0.98] transition"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
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

            <div
                className={`relative ml-3 h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-green-600" : "bg-gray-300"
                    }`}
            >
                <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"
                        }`}
                />
            </div>
        </button>
    );
};