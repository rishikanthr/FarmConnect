import { useState } from "react";
import axios from "axios";

const AddToCartButton = ({ userId, productId }) => {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId) return alert("Please login to add to cart.");
    setLoading(true);
    try {   
      await axios.post("http://localhost:3000/api/cart/add", { userId, productId });
      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">
      {loading ? "Adding…" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;