import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerCameraDirection } from "@capacitor/barcode-scanner";
import { ArrowLeft, Camera, X } from "lucide-react";

export const QRScan = () => {
    const navigate = useNavigate();

    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startScanner = async () => {
        try {
            setError(null);
            setScanning(true);

            const result = await CapacitorBarcodeScanner.scanBarcode({
                hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
                cameraDirection:
                    CapacitorBarcodeScannerCameraDirection.BACK,
                scanInstructions:
                    "Placez le QR code dans le cadre",
            });

            console.log("QR CODE:", result.ScanResult);

            if (!result.ScanResult) {
                setError("Aucun QR code détecté.");
                return;
            }

            // QR code contains the product ID
            const resultObject = JSON.parse(result.ScanResult);
            const productId = resultObject.productId;
            navigate(`/products/${productId}`);
        } catch (error: any) {
            console.error("Scanner error:", error);
            setError(
                error?.message ||
                "Impossible de démarrer le scanner."
            );
        } finally {
            setScanning(false);
        }
    };

    useEffect(() => {
        startScanner();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-10">

                <div className="flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <h1 className="font-bold text-lg">
                        Scanner un produit
                    </h1>

                    <div className="w-11" />

                </div>
            </header>

            {/* Scanner information */}
            {scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="relative w-64 h-64">

                        {/* Top left */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-green-500 rounded-tl-xl" />

                        {/* Top right */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-green-500 rounded-tr-xl" />

                        {/* Bottom left */}
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-green-500 rounded-bl-xl" />

                        {/* Bottom right */}
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-green-500 rounded-br-xl" />
                    </div>

                    <div className="mt-8 flex items-center gap-2">
                        <Camera size={18} />

                        <p className="text-sm">
                            Placez le QR code dans le cadre
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 px-6">

                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center text-gray-900">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <X
                                size={30}
                                className="text-red-600"
                            />
                        </div>

                        <h2 className="text-xl font-bold">
                            Erreur
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={startScanner}
                            className="mt-6 w-full rounded-2xl bg-green-600 py-3 font-semibold text-white"
                        >
                            Réessayer
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-3 w-full rounded-2xl bg-gray-100 py-3 font-semibold text-gray-700"
                        >
                            Retour
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};