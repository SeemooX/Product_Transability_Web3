import { NavBar } from "@/components/NavBar";
import { ArrowLeft, Search, SlidersHorizontal, Drill } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Product } from "@/types/product";
import { formatDate } from "@/utils/formateDate";
import { statusColors } from "@/utils/statusColor";
import { getProducts } from "@/api/productApi";
import { useAuth } from "@/context/AuthContext";

export const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const { role, user } = useAuth();

    const loadProducts = async (pageToLoad: number) => {
        if (!role) return;

        if (pageToLoad === 1)
            setLoading(true);
        else
            setLoadingMore(true);

        try {
            const result = await getProducts(role, pageToLoad);

            if (pageToLoad === 1) {
                setProducts(result.products);
            } else {
                setProducts((prev) => [...prev, ...result.products]);
            }

            setHasMore(
                result.pagination.page < result.pagination.totalPages
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadProducts(1);
    }, []);

    useEffect(() => {
        if (page === 1) return;

        loadProducts(page);
    }, [page]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">

                    <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

                    <p className="mt-5 text-gray-700 font-medium">
                        Chargement des produits...
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Veuillez patienter
                    </p>

                </div>
            </div>
        );
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingMore) {
            setPage((prev) => prev + 1);
        }
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col" onScroll={handleScroll}>

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
                        to={`/products/${product.id_product}`}
                        className="block"
                    >
                        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center transition hover:shadow-md active:scale-[0.98]">

                            <div className="flex gap-4">

                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Drill size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.reference}</p>
                                </div>

                            </div>

                            <div className="text-right">

                                <p className={`font-semibold text-sm ${statusColors[product.currentStatus] ?? "text-gray-500"
                                    }`}>
                                    {product.currentStatus}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(product.createdAt)}
                                </p>

                            </div>

                        </div>
                    </Link>
                ))}
            </main>

            {hasMore && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={loadingMore}
                        className="text-green-600 text-sm font-semibold active:opacity-60 transition"
                    >
                        {loadingMore ? "Chargement..." : "Voir plus"}
                    </button>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <p className="text-center text-gray-400 text-sm mt-5">
                    Tous les produits ont été chargés.
                </p>
            )}

            <NavBar />
        </div>
    );
}