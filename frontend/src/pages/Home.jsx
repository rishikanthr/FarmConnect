import { Link, Navigate } from "react-router-dom";

const Home = () => {
  // If they’re already logged in, skip the landing page
  const user = JSON.parse(localStorage.getItem("user"));
  // if (user?.role === "farmer")   return <Navigate to="/farmer" />;
  // if (user?.role === "consumer") return <Navigate to="/consumer" />;
  // if (user?.role === "admin")    return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to FarmConnect</h1>

      <Link
        to="/login"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Home;
