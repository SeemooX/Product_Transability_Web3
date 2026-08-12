import { NavBar } from "@/components/NavBar";
import { ArrowLeft, Search, SlidersHorizontal, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Product } from "@/types/product";
import { formatDate } from "@/utils/formateDate";
import { statusColors } from "@/utils/statusColor";
import { getHomeProducts } from "@/api/productApi";
import { useAuth } from "@/context/AuthContext";

export const HistoryPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(""); // What the user is typing
    const [debouncedSearch, setDebouncedSearch] = useState(""); // what is actually sent to the API (used to reduce requests)
    const [sort, setSort] = useState("createdAt_desc");

    const mainRef = useRef<HTMLDivElement>(null)

    const { role } = useAuth();

    const loadProducts = async (pageToLoad: number) => {
        if (!role) return;

        if (pageToLoad === 1)
            setLoading(true);
        else
            setLoadingMore(true);

        try {
            const result = await getHomeProducts(role, pageToLoad, debouncedSearch);

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
        loadProducts(page);
    }, [page, debouncedSearch, sort]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer); // Cleanup
    }, [search]);

    // Reset pagination when search/sort changes
    useEffect(() => {
        setPage(1);
        setHasMore(true);

        mainRef.current?.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, [debouncedSearch, sort]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingMore) {
            setPage((prev) => prev + 1);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">
                    <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
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

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col"
            onScroll={handleScroll}
        >
            {/* Header */}
            <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <Link to="/home">
                        <ArrowLeft size={22} />
                    </Link>

                    <h1 className="font-bold text-lg">
                        {role.toLowerCase() !== "transporter" ? "Liste des produits" : "Liste des produits valable"}
                    </h1>

                    <SlidersHorizontal size={20} />
                </div>

                <div className="flex gap-3 mt-5">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 py-3">
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                        ) : (
                            <Search size={18} className="text-gray-400" />
                        )}

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="ml-3 flex-1 bg-transparent outline-none text-sm"
                        />

                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-gray-400 text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            setSort((prev) =>
                                prev === "createdAt_desc"
                                    ? "createdAt_asc"
                                    : "createdAt_desc"
                            )
                        }
                        className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center"
                    >
                        <SlidersHorizontal size={20} />
                    </button>

                </div>

                {search && (
                    <p className="mt-4 text-sm text-gray-500">
                        Résultats pour{" "}
                        <span className="font-semibold">
                            "{search}"
                        </span>
                    </p>
                )}
            </header>

            {/* Product List */}
            <main
                ref={mainRef}
                className="flex-1 px-4 py-5 space-y-3 overflow-y-auto"
            >
                {products.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        {search ? (
                            <>
                                <Search size={54} className="text-gray-300" />

                                <h2 className="mt-5 font-semibold text-gray-700">
                                    Aucun résultat
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Aucun produit ne correspond à "{search}"
                                </p>

                                <button
                                    onClick={() => setSearch("")}
                                    className="mt-5 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold"
                                >
                                    Effacer la recherche
                                </button>
                            </>
                        ) : (
                            <>
                                <Package size={54} className="text-gray-300" />

                                <h2 className="mt-5 font-semibold text-gray-700">
                                    Aucun produit
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Vous n'avez aucun produit enregistré.
                                </p>
                            </>
                        )}

                    </div>

                )}

                {products.map((product) => (
                    <Link
                        key={product.id_product}
                        to={`/history/${product.id_product}`}
                        className="block"
                    >
                        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center transition hover:shadow-md active:scale-[0.98]">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Package size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {product.reference}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`font-semibold text-sm ${statusColors[product.currentStatus] ??
                                    "text-gray-500"
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

            {hasMore && products.length > 0 && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={loadingMore}
                        className="text-green-600 text-sm font-semibold active:opacity-60 transition"
                    >
                        {loadingMore
                            ? "Chargement..."
                            : "Voir plus"}
                    </button>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <p className="text-center text-gray-400 text-sm mt-5">
                    {search
                        ? "Fin des résultats."
                        : "Tous les produits ont été chargés."}
                </p>
            )}

            <NavBar />

        </div>
    );
};