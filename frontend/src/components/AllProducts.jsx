import { useEffect, useState } from "react";
import axios from "axios";
import AddToCartButton from "./AddToCartButton";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products/getAll")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-green-700 mb-10 text-center tracking-wide">
        🌾 Explore All Farm Fresh Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={p.imageURL || "/no-image.png"}
                alt={p.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 truncate">{p.title}</h3>
              <p className="text-sm text-gray-500 h-10 overflow-hidden">{p.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-green-700 font-bold text-lg">₹{p.price}</span>
                <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  Stock: <strong>{p.stock}</strong>
                </span>
              </div>

              <div>
                <span className="text-sm">
                  Organic:
                  <span
                    className={`ml-1 font-semibold ${
                      p.certifiedOrganic ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                  </span>
                </span>
              </div>

              <div className="pt-3">
                <AddToCartButton userId={user?.id} productId={p._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;
