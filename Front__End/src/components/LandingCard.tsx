import { ShieldCheck } from "lucide-react";

export default function LandingCard() {
    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-[#0B4E3B] via-[#0D6A4D] to-[#0B7B56] flex flex-col">

            {/* ================= HERO ================= */}
            <section className="relative h-[38vh] flex items-end justify-center overflow-visible">

                {/* Spot lights */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-6 top-0 h-32 w-32 rounded-full bg-white/45 blur-3xl" />
                    <div className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
                    <div className="absolute right-6 top-0 h-32 w-32 rounded-full bg-white/45 blur-3xl" />
                </div>

                {/* Illustration */}
                <div className="relative mb-[-20px] z-20 flex flex-col items-center">

                    {/* Shield */}
                    <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20 backdrop-blur-sm">
                        <ShieldCheck
                            className="text-white"
                            size={56}
                        />
                    </div>

                    {/* Package */}
                    <div className="relative z-20 -mt-6 h-28 w-36 rounded-md bg-[#DDA357] shadow-2xl">
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-[#EAB569]" />
                        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#FFE4A6]" />
                        <div className="absolute right-8 top-0 h-8 w-3 bg-[#F5D18C]" />
                        <div className="absolute bottom-3 right-3 h-4 w-8 rounded bg-white" />
                    </div>

                    {/* Conveyor */}
                    <div className="relative -mt-2 h-12 w-64 rounded-full bg-[#2A2A32] shadow-xl">
                        <div className="absolute inset-2 rounded-full bg-[#44444F]" />

                        <div className="absolute left-5 top-1/2 flex -translate-y-1/2 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 w-3 rounded-full bg-gray-300"
                                />
                            ))}
                        </div>
                    </div>

                </div>

            </section>

            {/* ================= BOTTOM SHEET ================= */}

            <section className="relative -mt-2 flex-1 rounded-t-[52px] bg-white dark:bg-neutral-900 px-8 pt-12 pb-10">

                <h1 className="text-center text-[42px] leading-tight font-extrabold text-black dark:text-white">
                    Traçabilité
                    <br />
                    de Produits
                </h1>

                <p className="mt-6 text-center text-lg leading-8 text-gray-500 dark:text-gray-400">
                    Chaque étape. Transparente.
                    <br />
                    Immutable. Vérifiable.
                </p>

                <div className="mt-10 flex flex-col gap-4">

                    <button className="h-16 rounded-2xl bg-[#17B347] text-lg font-semibold text-white transition hover:bg-[#14993D]">
                        Se connecter
                    </button>

                    <button className="h-16 rounded-2xl border border-gray-300 bg-white text-lg font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                        Découvrir
                    </button>

                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Powered by Blockchain</span>
                </div>

            </section>
        </div>
    );
}