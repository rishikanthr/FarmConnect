import { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user here
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3000/api/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch((err) => {
        console.error("Cart load error:", err);
        setError("Failed to load cart");
      });
  }, [userId]);

  if (!userId) return <p>Please login to view cart.</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cart) return <p>Loading…</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cart.products.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul className="space-y-4">
          {cart.products.map((item) => (
            <li key={item.productId._id} className="border p-4 rounded bg-white">
              <p className="font-semibold">{item.productId.title}</p>
              <p>Price: ₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
