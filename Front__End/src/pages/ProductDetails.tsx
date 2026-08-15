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
import { Link, useNavigate, useParams } from "react-router";
import type { ProductMan } from "@/types/product";
import { formatDate } from "@/utils/formateDate";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState<ProductMan>();
  const [infos, setInfos] = useState(false);
  const [loading, setLoading] = useState(true);

  const { role } = useAuth();
  const navigate = useNavigate();

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
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>

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

        {role.toLowerCase() === "manufacturer" ? (
          <button
            className="w-full mt-5 bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center justify-between"
            onClick={() => setInfos(true)}
          >
            <span className="font-semibold text-lg">
              Informations techniques
            </span>

            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ) : (
          <Link
            to={`/products/addstep/${id}`}
            className="w-full mt-5 bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center justify-between"
          >
            <span className="font-semibold text-lg">
              Ajouter une étape
            </span>

            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        )}

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

      {infos && (
        <>
          <div
            onClick={() => setInfos(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] shadow-2xl z-50 animate-slide-up"
          >
            <div className="flex justify-center pt-3">
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Informations techniques
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Données enregistrées sur le produit
                </p>
              </div>
            </div>

            <div className="px-6 pb-8 pt-4 space-y-5">

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Description
                </p>

                <p className="mt-3 text-[15px] leading-7 text-gray-700">
                  {productDetails?.description || "Aucune description disponible."}
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  QR Code
                </p>

                <p className="mt-2 text-sm font-mono text-gray-700 break-all">
                  {productDetails?.qrCode}
                </p>
              </div>

              {/* Metadata Hash */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Metadata Hash
                </p>

                <p className="mt-2 text-xs font-mono text-gray-700 break-all leading-6">
                  {productDetails?.metadataHash}
                </p>
              </div>

              <button
                onClick={() => setInfos(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl py-4 transition"
              >
                Fermer
              </button>

            </div>
          </div>
        </>
      )}

      <NavBar />

    </div>
  );
}