import SearchByTitle from "../components/SearchByTitle";
import CartButton from "../components/CartButton";
import { useNavigate } from "react-router-dom";

const SearchTitlePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-800">🔍 Search Products by Title</h1>
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

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <SearchByTitle />
        </div>
      </div>
    </div>
  );
};

export default SearchTitlePage;
