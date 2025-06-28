import SearchByFarmer from "../components/SearchByFarmerId";
import CartButton from "../components/CartButton";
import { useNavigate } from "react-router-dom";

const SearchFarmerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-bold text-green-800">🔍 Search Products by Farmer</h1>
          <div className="flex gap-4">
            <CartButton />
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl shadow-md transition-all"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Component */}
        <SearchByFarmer />
      </div>
    </div>
  );
};

export default SearchFarmerPage;
