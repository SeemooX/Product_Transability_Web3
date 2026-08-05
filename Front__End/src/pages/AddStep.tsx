import { ArrowLeft, ChevronDown, CalendarDays, Camera, X } from "lucide-react";
import { Link } from "react-router";

export const AddStep = () => {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col">

            {/* Header */}
            <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <Link to="/products">
                        <button>
                            <ArrowLeft size={22} />
                        </button>
                    </Link>

                    <h1 className="text-lg font-semibold">
                        Ajouter une étape
                    </h1>

                    <div className="w-6"></div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">

                {/* Step Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Type d'étape
                    </label>

                    <div className="bg-white rounded-2xl border px-4 py-3 flex justify-between items-center">
                        <span>Réception</span>
                        <ChevronDown size={20} className="text-gray-500" />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Localisation
                    </label>

                    <input
                        type="text"
                        defaultValue="Entrepôt Lesquin"
                        className="w-full rounded-2xl border bg-white px-4 py-3 outline-none"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Date et heure
                    </label>

                    <div className="bg-white rounded-2xl border px-4 py-3 flex justify-between items-center">
                        <span>14/02/2024 &nbsp; 16:10</span>
                        <CalendarDays size={20} className="text-gray-500" />
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Commentaire (optionnel)
                    </label>

                    <textarea
                        rows={4}
                        defaultValue="Réception conforme."
                        className="w-full resize-none rounded-2xl border bg-white px-4 py-3 outline-none"
                    />
                </div>

                {/* Photo */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Photo (optionnel)
                    </label>

                    <div className="flex items-center justify-between">

                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border bg-gray-200">
                            <img
                                src="/images/package.jpg"
                                alt="Package"
                                className="w-full h-full object-cover"
                            />

                            <button className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                                <X size={12} className="text-white" />
                            </button>
                        </div>

                        <button className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                            <Camera size={24} />
                        </button>

                    </div>
                </div>

                {/* Save Button */}
                <button className="w-full bg-green-600 text-white font-semibold py-4 rounded-2xl active:scale-95 transition">
                    Enregistrer l'étape
                </button>

            </main>
        </div>
    );
}