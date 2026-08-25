import {
    ArrowLeft,
    ChevronDown,
    Mail,
    Paperclip,
    Send,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { useState } from "react";

export const ContactUsPage = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO:
        // Send data to your backend
        //
        // {
        //   subject,
        //   message
        // }
    };

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
                            Nous contacter
                        </h1>

                        <p className="mt-1 text-sm text-green-100">
                            Notre équipe est là pour vous aider
                        </p>
                    </div>
                </div>
            </header>

            {/* White Sheet */}
            <main className="flex-1 -mt-8 overflow-y-auto rounded-t-[34px] bg-white px-6 pt-8 pb-10">
                {/* Intro */}
                <div className="mb-8 flex items-center gap-4 rounded-2xl bg-green-50 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                        <Mail
                            size={22}
                            className="text-green-600"
                        />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Une question ?
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-gray-500">
                            Envoyez-nous un message et nous vous répondrons
                            dès que possible.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Subject */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                            Sujet
                        </label>

                        <div className="relative">
                            <Select
                                value={subject}
                                onValueChange={(value) => setSubject(value ?? "")}
                            >
                                <SelectTrigger
                                    className="h-14 w-full rounded-2xl border-0 bg-gray-100 px-4 text-sm text-gray-800 shadow-none focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                                >
                                    <SelectValue placeholder="Sélectionner un sujet" />
                                </SelectTrigger>

                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="account">
                                        Mon compte
                                    </SelectItem>

                                    <SelectItem value="security">
                                        Sécurité
                                    </SelectItem>

                                    <SelectItem value="technical">
                                        Problème technique
                                    </SelectItem>

                                    <SelectItem value="other">
                                        Autre
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <ChevronDown
                                size={19}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                            Message
                        </label>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Décrivez votre demande..."
                            rows={7}
                            className="w-full resize-none rounded-2xl bg-gray-100 p-4 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Attachment */}
                    <button
                        type="button"
                        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-4 py-4 text-left active:scale-[0.98] transition"
                    >
                        <Paperclip
                            size={20}
                            className="text-gray-500"
                        />

                        <div>
                            <span className="block text-sm font-medium text-gray-700">
                                Ajouter une pièce jointe
                            </span>

                            <span className="text-xs text-gray-400">
                                Capture d'écran ou document
                            </span>
                        </div>
                    </button>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!subject || !message.trim()}
                        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        <Send size={19} />

                        <span>
                            Envoyer le message
                        </span>
                    </button>
                </form>

                {/* Response information */}
                <div className="mt-6 text-center">
                    <p className="text-xs leading-5 text-gray-400">
                        Nous faisons notre possible pour répondre à votre
                        demande dans les meilleurs délais.
                    </p>
                </div>
            </main>
        </div>
    );
};