import { getProductDetails } from "@/api/productApi";
import { NavBar } from "@/components/NavBar";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { ProductMan } from "@/types/product";
import { formatDate } from "@/utils/formateDate";

export default function ProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState<ProductMan>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bringedDetails = async () => {
      try {
        const data = await getProductDetails(id);
        setProductDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    bringedDetails();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 max-w-md mx-auto flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">

          <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

          <p className="mt-5 text-gray-700 font-medium">
            Chargement des details du produits...
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Veuillez patienter
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
        <div className="flex items-center justify-between">
          <Link to="/products">
            <ArrowLeft size={22} />
          </Link>

          <h1 className="text-lg font-semibold">
            Détail du produit
          </h1>

          <button>
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28">

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-sm p-5">

          <div className="flex gap-4">

            <img
              src="/images/drill.png"
              alt="Bosch Drill"
              className="w-24 h-24 object-contain"
            />

            <div className="flex-1">

              <h2 className="text-2xl font-bold leading-8">
                {productDetails?.name}
              </h2>

              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl mt-4">
                <ShieldCheck size={18} />
                <span className="font-medium">
                  Authentique
                </span>
                <Check size={16} />
              </div>

            </div>

          </div>

          {/* Information */}
          <div className="mt-7 space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Référence
              </span>

              <span className="font-medium">
                {productDetails?.reference}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Numéro de série
              </span>

              <span className="font-medium">
                {productDetails?.serialNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Date de fabrication
              </span>

              <span className="font-medium">
                {formatDate(productDetails?.createdAt || "12/02/2024")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Fabricant
              </span>

              <span className="font-medium">
                {productDetails?.manufacturerName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Garantie
              </span>

              <span className="font-medium">
                5 ans
              </span>
            </div>

          </div>

        </div>

        {/* Technical Information */}

        <button className="w-full mt-5 bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center justify-between">

          <span className="font-semibold text-lg">
            Informations techniques
          </span>

          <ChevronRight size={20} className="text-gray-400" />

        </button>

        {/* Current Status */}

        <section className="mt-6">

          <h3 className="font-semibold text-lg mb-4">
            Statut actuel
          </h3>

          <div className="bg-white rounded-3xl shadow-sm p-5">

            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <ShieldCheck
                  size={24}
                  className="text-green-600"
                />
              </div>

              <div>

                <h4 className="text-green-600 font-bold text-xl">
                  {productDetails?.currentStatus}
                </h4>

                <p className="text-gray-700 mt-1">
                  {productDetails?.currentLocation}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(productDetails?.statusSince || "12/02/2024")}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      <NavBar />

    </div>
  );
}