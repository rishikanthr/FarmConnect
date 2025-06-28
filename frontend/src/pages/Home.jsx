import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setShow(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-100 to-teal-100 flex flex-col items-center justify-center relative text-center overflow-hidden">

      {/* Animated Background Circles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-teal-300/30 rounded-full blur-2xl animate-pulse"
          style={{ transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.03}px)` }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-80 h-80 bg-yellow-300/25 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${scrollY * 0.04}px, ${-scrollY * 0.06}px)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6">
        <h1 className={`text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-800 text-transparent bg-clip-text mb-4 transition-all duration-1000 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          🌱 FarmConnect
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-xl">
          Connecting Farmers and Consumers for a Fresher Future
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow hover:bg-emerald-700 transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate("/register")}
          className="group w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-transform duration-300"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Home;
