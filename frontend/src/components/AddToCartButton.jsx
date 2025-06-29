import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddToCartButton = ({ userId, productId }) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    if (!userId) return alert("Please login to add to cart.");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/cart/add`, {
        userId,
        productId,
        quantity,
      });
      alert("Added to cart");
    } catch (err) {
      alert("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        type="number"
        step="0.1"
        min="0.1"
        value={quantity}
        onChange={(e) => setQuantity(parseFloat(e.target.value))}
        className="w-20 border px-2 py-1 rounded"
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {loading ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCartButton;
