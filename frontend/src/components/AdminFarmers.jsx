import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBan, FaUnlock, FaHourglassHalf, FaUser, FaEnvelope, FaIdCard } from "react-icons/fa";
import { MdAgriculture } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const token = localStorage.getItem("token");

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allFarmers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);

      if (selectedFarmer) {
        const updated = res.data.find((f) => f._id === selectedFarmer._id);
        if (updated) setSelectedFarmer(updated);
      }
    } catch (err) {
      console.error("Fetch farmers error", err);
    }
  };

  const act = async (url, msg, isDelete = false) => {
    try {
      await axios({
        method: isDelete ? "delete" : "patch",
        url,
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(msg);
      fetchFarmers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((f) =>
    (f.name + f.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-green-50 to-green-200 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl border border-green-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3 animate-fade-in">
            <MdAgriculture className="text-4xl" /> Admin — Farmer Panel
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search farmers by name or email..."
              className="w-full px-5 py-3 text-lg border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Farmer List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((f) => (
                <div
                  key={f._id}
                  onClick={() => setSelectedFarmer(f)}
                  className={`transition-all duration-300 cursor-pointer border-l-4 border-green-300 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl px-5 py-4 ${
                    selectedFarmer?._id === f._id ? "border-l-8 border-green-500 scale-[1.01]" : ""
                  }`}
                >
                  <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    <FaUser /> {f.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <FaEnvelope className="text-green-400" /> {f.email}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center italic col-span-2 mt-4">
                No farmers found 🌾
              </p>
            )}
          </div>

          {/* Farmer Details with Ban/Restrict */}
          {selectedFarmer && (
            <div className="mt-10 bg-white border border-green-200 rounded-xl p-6 shadow-xl animate-fade-in-up">
              <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <FaIdCard /> Farmer Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-base">
                <p>
                  <strong className="text-green-600">👤 Name:</strong> {selectedFarmer.name}
                </p>
                <p>
                  <strong className="text-green-600">📧 Email:</strong> {selectedFarmer.email}
                </p>
                <p>
                  <strong className="text-green-600">🆔 ID:</strong>{" "}
                  <span className="bg-green-100 px-2 py-1 rounded text-sm font-mono">
                    {selectedFarmer._id}
                  </span>
                </p>
                <p>
                  <strong className="text-green-600">🔒 Status:</strong>{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                      selectedFarmer.status === "active"
                        ? "bg-green-200 text-green-800"
                        : selectedFarmer.status === "banned"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {selectedFarmer.status}
                  </span>
                </p>
                <p className="sm:col-span-2">
                  <strong className="text-green-600">⏳ Restricted Until:</strong>{" "}
                  {selectedFarmer.restrictedUntil
                    ? new Date(selectedFarmer.restrictedUntil).toLocaleString()
                    : "None"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                {selectedFarmer.status === "active" &&
                  (!selectedFarmer.restrictedUntil ||
                    new Date(selectedFarmer.restrictedUntil) < new Date()) && (
                    <>
                      <button
                        onClick={() =>
                          act(
                            `${BASE_URL}/api/admin/users/${selectedFarmer._id}/restrict/1d`,
                            "Restricted for 1 day"
                          )
                        }
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                      >
                        <FaHourglassHalf className="inline mr-2" />
                        Restrict 1 Day
                      </button>
                      <button
                        onClick={() =>
                          act(
                            `${BASE_URL}/api/admin/users/${selectedFarmer._id}/restrict/7d`,
                            "Restricted for 7 days"
                          )
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                      >
                        <FaHourglassHalf className="inline mr-2" />
                        Restrict 7 Days
                      </button>
                      <button
                        onClick={() =>
                          act(
                            `${BASE_URL}/api/admin/users/${selectedFarmer._id}/ban`,
                            "User banned",
                            true
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                      >
                        <FaBan className="inline mr-2" />
                        Ban
                      </button>
                    </>
                  )}

                {(selectedFarmer.status === "banned" ||
                  (selectedFarmer.restrictedUntil &&
                    new Date(selectedFarmer.restrictedUntil) > new Date())) && (
                  <button
                    onClick={() =>
                      act(
                        `${BASE_URL}/api/admin/users/${selectedFarmer._id}/unban`,
                        "User unbanned"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                  >
                    <FaUnlock className="inline mr-2" />
                    Unban
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFarmers;
