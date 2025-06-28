// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChatPage from "./pages/ChatPage";
import CartPage from "./pages/CartPage";
import SearchTitlePage from "./pages/SearchTitlePage";
import SearchFarmerPage from "./pages/SearchFarmerPage";
import FarmerProductsPage from "./pages/FarmerProductsPage";
import AskAI from "./components/AskAI";
import ImagePredictor from "./components/ImagePredictor";
import WalletPage from "./pages/WalletPage";
import AllProducts from "./components/AllProducts";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
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
          <Route path="/search-title" element={<SearchTitlePage />} />
          <Route path="/search-farmer" element={<SearchFarmerPage />} />
          <Route path="/farmer/products" element={<FarmerProductsPage />} />
          <Route path="/farmer/disease-predictor" element={<ImagePredictor />} />
          <Route path="/farmer/ai-assistant" element={<AskAI />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/all-products" element={<AllProducts />} />  
        </Routes>
      </Router>
  );
};

export default App;
