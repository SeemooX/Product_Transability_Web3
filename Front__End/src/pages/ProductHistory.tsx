import { NavBar } from "@/components/NavBar";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { ProductStatusHistory } from "@/types/product";
import { formatDate } from "@/utils/formateDate";
import { getStatusUI } from "@/components/statusUIMap";
import { getProductHistory } from "@/api/productApi";

export const ProductHistory = () => {
    const [history, setHistory] = useState<ProductStatusHistory[]>();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const bringedHistory = async () => {
            try {
                const data = await getProductHistory(id);
                setHistory(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        bringedHistory();
    }, [])

    const timeline: any = history?.map((item) => (
        {
            ...item,
            ...getStatusUI(item.code) // since itself returns an object
        }
    ))

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">

                    <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

                    <p className="mt-5 text-gray-700 font-medium">
                        Chargement de l'historique du produits...
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Veuillez patienter
                    </p>

                </div>
            </div>
        );
    }

    /* const history = [
        {
            date: "20/02/2024",
            time: "10:15",
            title: "Vendu au client",
            place: "Client final",
            location: "Lens, France",
            color: "bg-green-500",
            icon: <Check size={14} className="text-white" />,
        },
        {
            date: "18/02/2024",
            time: "09:30",
            title: "Produit disponible",
            place: "Leroy Merlin Lens",
            location: "Lens, France",
            color: "bg-purple-500",
            icon: <Store size={14} className="text-white" />,
        },
        {
            date: "16/02/2024",
            time: "14:45",
            title: "Reçu en magasin",
            place: "Leroy Merlin Lens",
            location: "Lens, France",
            color: "bg-blue-500",
            icon: <PackageCheck size={14} className="text-white" />,
        },
        {
            date: "15/02/2024",
            time: "08:20",
            title: "Expédié vers magasin",
            place: "Plateforme Lesquin",
            location: "Lesquin, France",
            color: "bg-green-500",
            icon: <Check size={14} className="text-white" />,
        },
        {
            date: "14/02/2024",
            time: "16:10",
            title: "Stocké en entrepôt",
            place: "Entrepôt Lesquin",
            location: "Lesquin, France",
            color: "bg-purple-500",
            icon: <Warehouse size={14} className="text-white" />,
        },
        {
            date: "13/02/2024",
            time: "11:00",
            title: "Transport terminé",
            place: "DHL Express",
            location: "Duisburg, Allemagne",
            color: "bg-green-500",
            icon: <Check size={14} className="text-white" />,
        },
    ]; */

    return (
        <div className="max-w-md mx-auto h-[100dvh] bg-gray-100 flex flex-col">

            {/* Header */}
            <header className="bg-white px-5 pt-10 pb-5 shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between">

                    <Link to="/history">
                        <ArrowLeft size={22} />
                    </Link>

                    <h1 className="text-lg font-semibold">
                        Historique du produit
                    </h1>

                    <button>
                        <SlidersHorizontal size={20} />
                    </button>

                </div>
            </header>

            {/* Timeline */}
            <main
                className="flex-1 overflow-y-auto px-4 py-5"
                style={{ paddingBottom: "7rem" }}
            >

                <div className="bg-white rounded-3xl shadow-sm">

                    {timeline.map((step: any, index: any) => (
                        <div
                            key={index}
                            className="grid grid-cols-[75px_32px_1fr_20px] gap-3 px-4 py-5"
                        >

                            {/* Date */}
                            <div className="text-right">
                                <p className="text-sm font-medium">
                                    {formatDate(step.createdAt)}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {step.code.length >= 11 ? step.code.slice(0, 11) + "..." : step.code}
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="relative flex justify-center">

                                {/* Line above */}
                                {index !== 0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-1/2 w-[2px] bg-green-500" />
                                )}

                                {/* Line below */}
                                {index !== timeline.length - 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 h-1/2 w-[2px] bg-green-500" />
                                )}

                                {/* Icon */}
                                <div
                                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${step.color}`}
                                >
                                    {step.icon}
                                </div>

                            </div>

                            {/* Information */}
                            <div>
                                <h3 className="font-semibold">
                                    {step.label}
                                </h3>

                                <p className="mt-1 text-sm text-gray-700">
                                    Hash: {step.txHash?.slice(0, 10)}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {step.location}
                                </p>
                            </div>

                            {/* Arrow */}
                            {/* <div className="flex items-start justify-end">
                                <ChevronRight size={18} className="mt-1 text-gray-400" />
                            </div> */}

                        </div>
                    ))}

                </div>

            </main>

            <NavBar />

        </div>
    );
}