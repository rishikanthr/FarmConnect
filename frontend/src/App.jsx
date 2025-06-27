// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChatPage from "./pages/ChatPage";
import CartPage from "./pages/CartPage";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <CartProvider userId={user?._id}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/farmer"
            element={user?.role === "farmer" ? <FarmerDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/consumer"
            element={user?.role === "consumer" ? <ConsumerDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
