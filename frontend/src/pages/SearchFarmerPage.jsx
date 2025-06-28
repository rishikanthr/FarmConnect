import SearchByFarmer from "../components/SearchByFarmerId";
import CartButton from "../components/CartButton";
import { useNavigate } from "react-router-dom";

const SearchFarmerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">🔍 Search by Farmer</h1>
        <div className="flex gap-3">
          <CartButton />
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>
      </div>

      <SearchByFarmer />
    </div>
  );
};

export default SearchFarmerPage;
