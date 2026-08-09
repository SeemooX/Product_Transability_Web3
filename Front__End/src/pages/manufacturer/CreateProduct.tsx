import { useEffect, useState } from "react";
import { ArrowLeft, PackagePlus, Check, X } from "lucide-react";
import { Link } from "react-router";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKit } from "@reown/appkit/react";
import { useProductContract } from "@/hooks/useProductContract";
import { createProductFlow } from "@/services/product.service";

interface ProductForm {
  name: string;
  reference: string;
  serialNumber: string;
  description: string;
}

export default function CreateProduct() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    reference: "",
    serialNumber: "",
    description: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { isConnected } = useAppKitAccount();
  const { open, /* close */ } = useAppKit();
  const { getContract } = useProductContract();

  useEffect(() => {
    if (!isConnected) {
      open({
        view: "Connect",
        namespace: "eip155",
      });
    }
  }, [isConnected, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsCreating(true);

      const contract = await getContract();

      const result = await createProductFlow(form, contract);

      if (result) {
        setShowSuccess(true);
      } else {
        setShowFailure(true);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}

      <header className="bg-white px-5 pt-10 pb-5 shadow-sm">
        <div className="flex items-center justify-between">

          <Link to="/home">
            <ArrowLeft size={22} />
          </Link>

          <h1 className="text-lg font-semibold">
            Créer un produit
          </h1>

          <div className="w-6" />

        </div>
      </header>

      <main className="flex-1 px-5 py-6 overflow-y-auto">

        {/* Title */}

        <div className="mb-6">

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
            <PackagePlus size={30} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold">
            Nouveau produit
          </h2>

          <p className="text-gray-500 mt-1">
            Enregistrez un nouveau produit dans le système.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-5">

            <h3 className="font-semibold text-lg">
              Informations du produit
            </h3>

            {/* Name */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Nom du produit
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Perceuse Bosch X200"
                maxLength={150}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-600"
              />

            </div>

            {/* Reference */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Référence
              </label>

              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="BOSCH-X200-4S87"
                maxLength={80}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-600"
              />

            </div>

            {/* Serial Number */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Numéro de série
              </label>

              <input
                type="text"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                placeholder="SN-2024-02-14587"
                maxLength={120}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-600"
              />

            </div>

            {/* Description */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description du produit..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-600"
              />

            </div>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold shadow active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreating ? "Création en cours..." : "Créer le produit"}
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
              Produit créé avec succès
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Le produit a été enregistré avec succès
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
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">

          {/* Failure icon */}

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <X
              size={32}
              className="text-red-600"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Échec de la création
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Une erreur est survenue lors de la création du produit.
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
      )}

    </div>
  );
}