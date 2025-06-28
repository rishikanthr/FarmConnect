import { useEffect, useState } from "react";
import axios from "axios";
import AddToCartButton from "./AddToCartButton";
import CartButton from "./CartButton";
import { Leaf } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const AllProducts = ({ showCartButton = true }) => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/getAll`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Cart Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-green-600 tracking-wide">
          <span className="inline-flex items-center gap-2">
            <Leaf className="w-7 h-7 text-green-500 animate-pulse" />
            Farm Fresh Products
          </span>
        </h2>
        {/* ✅ Only show cart button if not admin and allowed by props */}
        {showCartButton && !isAdmin && <CartButton />}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={p.imageURL || "/no-image.png"}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{p.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 h-10">{p.description}</p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 font-bold text-base">₹{p.price}</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  Stock: <strong>{p.stock}</strong>
                </span>
              </div>

              <div className="text-xs text-gray-700 mt-1">
                Organic:{" "}
                <span
                  className={`font-semibold ${
                    p.certifiedOrganic ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                </span>
              </div>

              {/* ✅ Farmer Info */}
              <div className="text-sm text-gray-700 pt-2 space-y-1">
                <p>
                  👨‍🌾 Farmer:{" "}
                  <span className="font-medium text-indigo-700">
                    {p.farmerName || "Unknown"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  📍 Location: {p.farmerLocation || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  🆔 ID:{" "}
                  <span className="font-mono text-gray-800">{p.farmerId}</span>
                </p>
              </div>

              {/* ✅ Show Add to Cart only if not admin */}
              {!isAdmin && (
                <div className="pt-3 flex justify-end">
                  <AddToCartButton userId={user?.id} productId={p._id} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;
