import { useEffect, useState } from "react";
import axios from "axios";
import AddToCartButton from "./AddToCartButton";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user info

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products/getAll")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">🌿 All Farm Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg shadow-md overflow-hidden bg-white">
            <img
              src={p.imageUrl || "/no-image.png"}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.description}</p>
              <div className="text-sm font-medium text-green-800 mb-1">₹{p.price}</div>
              <div className="text-sm">Stock: <span className="font-medium">{p.stock}</span></div>
              <div className="text-sm">
                Organic:{" "}
                <span className={p.certifiedOrganic ? "text-green-600" : "text-red-500"}>
                  {p.certifiedOrganic ? "Yes ✅" : "No ❌"}
                </span>
              </div>
              <div className="mt-3">
                <AddToCartButton userId={user?.id} productId={p._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
