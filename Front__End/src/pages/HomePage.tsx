import { getProducts } from "@/api/productApi";
import { getStatistics } from "@/api/statistics";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Bell, Drill, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { ManufactStat } from "@/types/statistics";
import type { Product } from "@/types/product";

export const HomePage = () => {
  const [stats, setStats] = useState<ManufactStat>({
    total: "0",
    shipping: "0",
    shipped: "0",
    waiting: "0"
  });
  const [products, setProducts] = useState<Product[]>([]);
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProductsAndStats = async () => {
      try {
        const bringedProducts = await getProducts(role);
        const bringedStats = await getStatistics(role);
        setProducts(bringedProducts);
        setStats(bringedStats);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setStats({
          total: "0",
          shipping: "0",
          shipped: "0",
          waiting: "0"
        });
      } finally {
        setLoading(false);
      }
    }

    getUserProductsAndStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl">Loading movies...</p>
          </div>
        </main>
      </div>
    );
  }

  const newStats = [
    { value: stats.total, label: "Produits enregistrés", color: "bg-green-100", icon: "🟢" },
    { value: stats.shipping, label: "En transit", color: "bg-orange-100", icon: "🟡" },
    { value: stats.shipped, label: "Livrés", color: "bg-green-100", icon: "🟢" },
    { value: stats.waiting, label: "En attente", color: "bg-red-100", icon: "🔴" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col">

      {/* Header */}
      <div className="bg-green-600 rounded-b-[35px] px-5 pt-10 pb-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm">Bonjour,</p>
            <h1 className="text-3xl font-bold">Jean Dupont</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-green-500 px-4 py-1 rounded-full text-sm">Fabricant</span>

            <button className="relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-5 -mt-5 pb-24">

        <div className="bg-white rounded-3xl shadow p-5">
          <h2 className="font-semibold text-lg mb-4">Résumé</h2>

          <div className="grid grid-cols-2 gap-4">
            {newStats.map((item, index) => (
              <div key={index} className="border rounded-2xl p-4 shadow-sm">
                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-lg`}>
                  {item.icon}
                </div>

                <h3 className="text-3xl font-bold mt-3">{item.value}</h3>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white font-semibold py-4 rounded-2xl active:scale-95 transition">
          Créer un produit
        </button>

        <section className="mt-7">
          <h2 className="font-semibold text-lg mb-4">Produits récents</h2>

          <div className="bg-white rounded-3xl shadow divide-y">
            {products.map((product, index) => (
              <div key={index} className="flex justify-between items-center p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Drill size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.reference}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium balck`}>
                    {product.currentStatus}
                  </span>

                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <NavBar />
    </div>
  );
}