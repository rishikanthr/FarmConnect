// src/components/CartButton.jsx
import { Link } from "react-router-dom";

const CartButton = () => {
  return (
    <Link
      to="/cart"
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    >
      🛒 View Cart
    </Link>
  );
};

export default CartButton;
