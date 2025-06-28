// src/components/CartButton.jsx
import { Link } from "react-router-dom";

const CartButton = () => {
  return (
    <Link
      to="/cart"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-yellow-600 transform transition-all duration-300 hover:-translate-y-1"
    >
      🛒 <span>View Cart</span>
    </Link>
  );
};

export default CartButton;
