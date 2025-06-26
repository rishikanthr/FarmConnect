import { useEffect, useState } from "react";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products/getAll")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-700">All Products</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <li key={p._id} className="border p-4 rounded shadow bg-gray-50">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p>{p.description}</p>
            <p className="font-medium">₹{p.price}</p>
            <p>Stock: {p.stock}</p>
            <p>Organic: {p.certifiedOrganic ? "Yes ✅" : "No ❌"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllProducts;
