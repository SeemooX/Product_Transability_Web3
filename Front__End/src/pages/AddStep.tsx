import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    CalendarDays,
    Camera as CameraIcon,
    Check,
    ChevronDown,
    X,
} from "lucide-react";
import {
    Camera,
    MediaTypeSelection,
} from "@capacitor/camera";
import { Link, useParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { storeStatus, transporterStatus, warehouseStatus } from "@/utils/addTrace";
import { useProductContract } from "@/hooks/useProductContract";
import { addTraceabilityProductFlow } from "@/services/product.service";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { webPathToFile } from "@/utils/webToFile";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";

export const AddStep = () => {
    const { id } = useParams();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [location, setLocation] = useState("Entrepôt Lesquin");
    const [date, setDate] = useState("2024-02-14T16:10");
    const [comment, setComment] = useState("Réception conforme.");
    const [photo, setPhoto] = useState<File | null>(null); // Actual File object uploaded
    const [photoPreview, setPhotoPreview] = useState<string | null>(null); // URL used only to dispaly the image
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const [isModifying, setIsModifying] = useState(false);

    const { role } = useAuth();
    const { isConnected } = useAppKitAccount();
    const { open, /* close */ } = useAppKit();
    const { getContract } = useProductContract();

    const statusOptions =
        role.toUpperCase() === "TRANSPORTER"
            ? transporterStatus
            : role === "WAREHOUSE"
                ? warehouseStatus
                : role === "STORE"
                    ? storeStatus
                    : {};

    const statusLabels: Record<string, string> = {
        PICKED_UP: "Colis récupéré",
        DELIVERED_TO_WAREHOUSE: "Livré à l'entrepôt",
        PICKED_UP_FROM_WAREHOUSE: "Récupéré de l'entrepôt",
        DELIVERED_TO_STORE: "Livré au magasin",
        RECEIVED_AT_WAREHOUSE: "Reçu à l'entrepôt",
        READY_FOR_DISPATCH: "Prêt pour expédition",
        AVAILABLE_FOR_SALE: "Disponible à la vente",
    };

    useEffect(() => {
        if (!isConnected) {
            open({
                view: "Connect",
                namespace: "eip155",
            });
        }
    }, [isConnected, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsModifying(true);

            const formData = new FormData();

            formData.append("stepType", selectedStatus);
            formData.append("location", location);
            formData.append("date", date);
            formData.append("notes", comment);

            if (photo) {
                formData.append("photo", photo);
            }

            const contract = await getContract();

            const result = await addTraceabilityProductFlow(id, formData, contract);
            if (result) {
                setShowSuccess(true);
            }
        } catch (error) {
            console.error(error);
            setShowFailure(true);
        } finally {
            setIsModifying(false);
        }
    };

    const takePhoto = async () => {
        try {
            const result: any = await Camera.takePhoto({
                quality: 90,
                includeMetadata: true,
            });

            const file: File = await webPathToFile(
                result.webPath,
                `photo-${Date.now()}.jpg`
            );

            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            setPhoto(file);
            setPhotoPreview(result.webPath);
        } catch (error) {
            console.error("Failed to take photo:", error);
        }
    };

    const chooseFromGallery = async () => {
        try {
            const { results } = await Camera.chooseFromGallery({
                mediaType: MediaTypeSelection.Photo,
                allowMultipleSelection: false,
                limit: 1,
                includeMetadata: true,
            });

            const result: any = results[0];

            if (!result) return;

            const file: File = await webPathToFile(
                result.webPath,
                `photo-${Date.now()}.jpg`
            );

            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            setPhoto(file);
            setPhotoPreview(result.webPath);
        } catch (error) {
            console.error("Failed to choose photo:", error);
        }
    };

    const openPhotoOptions = async () => {
        const result = await ActionSheet.showActions({
            title: "Ajouter une photo",
            options: [
                {
                    title: "Prendre une photo",
                },
                {
                    title: "Choisir dans la galerie",
                },
                {
                    title: "Annuler",
                    style: ActionSheetButtonStyle.Destructive,
                },
            ],
        });

        if (result.index === 0) {
            await takePhoto();
        }

        if (result.index === 1) {
            await chooseFromGallery();
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">

            {/* Header */}
            <header className="bg-white px-5 pb-5 pt-10 shadow-sm">
                <div className="flex items-center justify-between">

                    <Link to="/products">
                        <button
                            type="button"
                            className="flex items-center justify-center"
                        >
                            <ArrowLeft size={22} />
                        </button>
                    </Link>

                    <h1 className="text-lg font-semibold">
                        Ajouter une étape
                    </h1>

                    <div className="w-6" />
                </div>
            </header>

            {/* Form */}
            <main className="flex-1 overflow-y-auto px-5 py-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Step Type */}
                    <div>
                        <label
                            htmlFor="step-status"
                            className="mb-2 block text-sm font-medium"
                        >
                            Type d'étape
                        </label>

                        <div className="relative">
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => {
                                    if (value !== null) {
                                        setSelectedStatus(value);
                                    }
                                }}                            >
                                <SelectTrigger className="w-full rounded-2xl border bg-white px-4 py-3 text-left">
                                    <SelectValue placeholder="Sélectionner une étape" />
                                </SelectTrigger>

                                <SelectContent className="rounded-2xl">
                                    {Object.entries(statusOptions).map(
                                        ([statusName, statusId]) => (
                                            <SelectItem
                                                key={statusId}
                                                value={String(statusId)}
                                                className="py-3"
                                            >
                                                {statusLabels[statusName] || statusName}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <ChevronDown
                                size={20}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-sm font-medium"
                        >
                            Localisation
                        </label>

                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            required
                            placeholder="Ex: Entrepôt Lesquin"
                            className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label
                            htmlFor="date"
                            className="mb-2 block text-sm font-medium"
                        >
                            Date et heure
                        </label>

                        <div className="relative">
                            <input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                required
                                className="w-full rounded-2xl border bg-white px-4 py-3 pr-12 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                            <CalendarDays
                                size={20}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="mb-2 block text-sm font-medium"
                        >
                            Commentaire (optionnel)
                        </label>

                        <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            placeholder="Ajouter un commentaire..."
                            className="w-full resize-none rounded-2xl border bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    {/* Photo */}
                    <div>
                        <label className="mb-3 block text-sm font-medium">
                            Photo (optionnel)
                        </label>

                        <div className="flex items-center justify-between">

                            {/* Preview */}
                            {photoPreview ? (
                                <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-gray-200">
                                    <img
                                        src={photoPreview}
                                        alt="Package"
                                        className="h-full w-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60"
                                    >
                                        <X
                                            size={12}
                                            className="text-white"
                                        />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-gray-100 text-xs text-gray-400">
                                    Aucune photo
                                </div>
                            )}

                            {/* Camera */}
                            <button
                                type="button"
                                onClick={openPhotoOptions}
                                className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200 transition active:scale-95"
                            >
                                <CameraIcon size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isModifying}
                        className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold shadow active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isModifying ? "Enregistrement de l'étape..." : "Enregistrer l'étape"}
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
                            Tracabilité ajouté avec succès
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            La Tracabilité du produit a été enregistré avec succès
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
                            Échec de la modification
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Une erreur est survenue lors de la modification
                            de la traçabilité du produit.
                            Veuillez réessayer.
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