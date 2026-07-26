import { NavBar } from "@/components/NavBar";
import { ArrowLeft, Search, SlidersHorizontal, Drill } from "lucide-react";
import { Link } from "react-router";

export const ProductsPage = () => {
    const products = [
        {
            id: "",
            name: "Perceuse Bosch X200",
            ref: "BOSCH-X200-4S87",
            date: "18/02/2024",
            status: "En magasin",
            color: "text-green-600",
        },
        {
            id: "",
            name: "Visseuse Makita 18V",
            ref: "MAK-18V-7845",
            date: "17/02/2024",
            status: "Livré",
            color: "text-green-500",
        },
        {
            id: "",
            name: "Marteau perforateur Hilti",
            ref: "HILTI-TE30-6574",
            date: "15/02/2024",
            status: "En transit",
            color: "text-blue-500",
        },
        {
            id: "",
            name: "Scie circulaire Dewalt",
            ref: "DEW-DCS-1654",
            date: "12/02/2024",
            status: "En attente",
            color: "text-orange-500",
        },
        {
            id: "",
            name: "Ponceuse Bosch GEX125",
            ref: "BOSCH-GEX-125",
            date: "10/02/2024",
            status: "Livré",
            color: "text-green-500",
        },
    ];

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col">

            {/* Header */}
            <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <ArrowLeft size={22} />
                    <h1 className="font-bold text-lg">Liste des produits</h1>
                    <SlidersHorizontal size={20} />
                </div>

                <div className="flex gap-3 mt-5">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 py-3">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    <button className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </header>

            {/* Product List */}
            <main className="flex-1 px-4 py-5 space-y-3 overflow-y-auto">

                {products.map((product, index) => (
                    <Link
                        key={index}
                        to={`/products/${product.id}`}
                        className="block"
                    >
                        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center transition hover:shadow-md active:scale-[0.98]">

                            <div className="flex gap-4">

                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Drill size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.ref}</p>
                                </div>

                            </div>

                            <div className="text-right">

                                <p className={`font-semibold text-sm ${product.color}`}>
                                    {product.status}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {product.date}
                                </p>

                            </div>

                        </div>
                    </Link>
                ))}
            </main>
            <NavBar/>
        </div>
    );
}