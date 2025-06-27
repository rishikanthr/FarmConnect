// src/contexts/CartContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ userId, children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(res.data.products || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post("http://localhost:3000/api/cart/add", { userId, productId : p._id});
      fetchCart(); // update cart after adding
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post("http://localhost:3000/api/cart/remove", { userId, productId });
      fetchCart(); // update cart after removing
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
