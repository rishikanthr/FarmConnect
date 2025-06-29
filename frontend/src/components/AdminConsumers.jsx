import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBan, FaUnlock, FaHourglassHalf, FaUser, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminConsumers = () => {
  const [consumers, setConsumers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const token = localStorage.getItem("token");

  const fetchConsumers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allConsumers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumers(res.data);

      if (selectedConsumer) {
        const updated = res.data.find((c) => c._id === selectedConsumer._id);
        if (updated) setSelectedConsumer(updated);
      }
    } catch (err) {
      console.error("Fetch consumers error", err);
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
      fetchConsumers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  const filteredConsumers = consumers.filter((c) =>
    (c.name + c.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-blue-50 to-blue-200 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl border border-blue-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3 animate-fade-in">
            <MdPeopleAlt className="text-4xl" /> Admin — Consumer Panel
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              className="w-full px-5 py-3 text-lg border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Consumers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredConsumers.length > 0 ? (
              filteredConsumers.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedConsumer(c)}
                  className={`transition-all duration-300 cursor-pointer border-l-4 border-blue-300 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl px-5 py-4 ${
                    selectedConsumer?._id === c._id
                      ? "border-l-8 border-blue-500 scale-[1.01]"
                      : ""
                  }`}
                >
                  <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                    <FaUser /> {c.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <FaEnvelope className="text-blue-400" /> {c.email}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center italic col-span-2 mt-4">
                No consumers found 🫤
              </p>
            )}
          </div>

          {/* Consumer Details */}
          {selectedConsumer && (
            <div className="mt-10 bg-white border border-blue-200 rounded-xl p-6 shadow-xl animate-fade-in-up">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                🧾 Consumer Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-base">
                <p>
                  <strong className="text-blue-600">👤 Name:</strong> {selectedConsumer.name}
                </p>
                <p>
                  <strong className="text-blue-600">📧 Email:</strong> {selectedConsumer.email}
                </p>
                <p>
                  <strong className="text-blue-600">🆔 ID:</strong>{" "}
                  <span className="bg-blue-100 px-2 py-1 rounded text-sm font-mono">
                    {selectedConsumer._id}
                  </span>
                </p>
                <p>
                  <strong className="text-blue-600">🔒 Status:</strong>{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                      selectedConsumer.status === "active"
                        ? "bg-blue-200 text-blue-800"
                        : selectedConsumer.status === "banned"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {selectedConsumer.status}
                  </span>
                </p>
                <p className="sm:col-span-2">
                  <strong className="text-blue-600">⏳ Restricted Until:</strong>{" "}
                  {selectedConsumer.restrictedUntil
                    ? new Date(selectedConsumer.restrictedUntil).toLocaleString()
                    : "None"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                {selectedConsumer.status === "active" &&
                  (!selectedConsumer.restrictedUntil ||
                    new Date(selectedConsumer.restrictedUntil) < new Date()) && (
                    <>
                      <button
                        onClick={() =>
                          act(
                            `${BASE_URL}/api/admin/users/${selectedConsumer._id}/restrict/1d`,
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
                            `${BASE_URL}/api/admin/users/${selectedConsumer._id}/restrict/7d`,
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
                            `${BASE_URL}/api/admin/users/${selectedConsumer._id}/ban`,
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

                {(selectedConsumer.status === "banned" ||
                  (selectedConsumer.restrictedUntil &&
                    new Date(selectedConsumer.restrictedUntil) > new Date())) && (
                  <button
                    onClick={() =>
                      act(
                        `${BASE_URL}/api/admin/users/${selectedConsumer._id}/unban`,
                        "User unbanned"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
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

export default AdminConsumers;
