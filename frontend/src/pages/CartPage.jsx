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

  if (!userId)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-medium text-gray-700">
        Please login to view your cart.
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );

  if (!cart)
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-lg font-medium">
        Loading your cart...
      </div>
    );

  const totalPrice = cart.products.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-4xl font-bold text-green-800 mb-8 flex items-center gap-2">
          🛒 Your Cart
        </h2>

        {cart.products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium">
            No items in cart.
          </p>
        ) : (
          <>
            <ul className="space-y-6">
              {cart.products.map((item) => (
                <li
                  key={item.productId._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.productId.title}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.productId._id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-gray-700 space-y-1">
                    <p>💰 Price: ₹{item.productId.price}</p>
                    <p>📦 Quantity: {item.quantity} kg</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-2xl font-bold text-green-700">
                Total: ₹{totalPrice.toFixed(2)}
              </h3>
              <button
                onClick={handleCheckout}
                className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
              >
                ✅ Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
