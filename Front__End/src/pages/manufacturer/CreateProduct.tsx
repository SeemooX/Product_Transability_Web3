import { useState } from "react";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { Link } from "react-router";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(form);

    // await createProduct(form);
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
            className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold shadow active:scale-95 transition"
          >
            Créer le produit
          </button>

        </form>

      </main>

    </div>
  );
}