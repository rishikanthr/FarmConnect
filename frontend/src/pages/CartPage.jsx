import { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3000/api/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch(() => setError("Failed to load cart"));
  }, [userId]);

  const handleRemove = async (productId) => {
    try {
      await axios.post("http://localhost:3000/api/cart/remove", {
        userId,
        productId,
      });
      const res = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(res.data);
    } catch {
      alert("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post("http://localhost:3000/api/cart/checkout", { userId });
      alert("Purchase successful");
      const res = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.data?.error === "Insufficient wallet balance") {
        alert("Not enough balance in wallet. Please top up.");
      } else {
        alert("Checkout failed");
      }
    }
  };

  if (!userId) return <p>Please login to view cart.</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cart) return <p>Loading…</p>;

  const totalPrice = cart.products.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cart.products.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.products.map((item) => (
              <li key={item.productId._id} className="border p-4 rounded bg-white">
                <p className="font-semibold">{item.productId.title}</p>
                <p>Price: ₹{item.productId.price}</p>
                <p>Quantity: {item.quantity} kg</p>
                <button
                  onClick={() => handleRemove(item.productId._id)}
                  className="text-red-600 hover:underline mt-2 block"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-6">Total: ₹{totalPrice.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
