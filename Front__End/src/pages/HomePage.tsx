import { getProducts } from "@/api/productApi";
import { getStatistics } from "@/api/statistics";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Bell, ChevronRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import type { Statistics } from "@/types/statistics";
import type { Product } from "@/types/product";
import { buildStatsCards } from "@/utils/buildStatsCard";
import { statusColors } from "@/utils/statusColor";

export const HomePage = () => {
  const [stats, setStats] = useState<Statistics>({
    total: "0",
    shipping: "0",
    shipped: "0",
    waiting: "0"
  });
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

  const loadStats = async () => {
    try {
      const bringedStats = await getStatistics(role);

      setStats(bringedStats);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProducts(1);
    loadStats();
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

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMore &&
      !loadingMore
    ) {
      setPage((prev) => prev + 1);
    }
  }

  const newStats = buildStatsCards(role, stats)

  return (
    <div className="h-screen bg-gray-100 max-w-md mx-auto flex flex-col overflow-y-auto"
      onScroll={handleScroll}
    >
      {/* Header */}
      <div className="bg-green-600 rounded-b-[35px] px-5 pt-10 pb-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm">Bonjour,</p>
            <h1 className="text-3xl font-bold">{user.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-green-500 px-4 py-1 rounded-full text-sm">
              {role.slice(0, 1).toUpperCase()}{role.slice(1).toLowerCase()}
            </span>

            <button className="relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-5 -mt-5 pb-24">
        {/* Stats */}
        <div className="bg-white rounded-3xl shadow p-5">
          <h2 className="font-semibold text-lg mb-4">Résumé</h2>

          <div className="grid grid-cols-2 gap-4">
            {newStats.map((item, index) => (
              <div key={index} className="border rounded-2xl p-4 shadow-sm">
                <div
                  className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-lg`}
                >
                  {item.icon}
                </div>

                <h3 className="text-3xl font-bold mt-3">{item.value}</h3>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Product */}
        <button className="w-full bg-green-600 text-white font-semibold py-4 rounded-2xl active:scale-95 transition mt-5">
          Créer un produit
        </button>

        {/* Products */}
        <section className="mt-7">
          <h2 className="font-semibold text-lg mb-4">Produits récents</h2>

          <div className="bg-white rounded-3xl shadow divide-y">
            {products.map((product) => (
              <div
                key={product.id_product}
                className="flex justify-between items-center p-4"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Package size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {product.reference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${statusColors[product.currentStatus] ?? "text-gray-500"}`}>
                    {product.currentStatus}
                  </span>

                  <ChevronRight
                    size={18}
                    className="text-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
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
        </section>
      </main>

      <NavBar />
    </div>
  );
}