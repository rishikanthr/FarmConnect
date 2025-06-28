import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBan, FaUnlock, FaHourglassHalf } from "react-icons/fa";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
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
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-600 text-lg">
        🔄 Loading users…
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        👤 User Management Dashboard
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs sticky top-0">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u, idx) => {
              const restricted =
                u.restrictedUntil && new Date(u.restrictedUntil) > Date.now();

              return (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 font-medium">
                    {u.status === "banned" ? (
                      <span className="text-red-600">Banned 🛑</span>
                    ) : restricted ? (
                      <span className="text-yellow-600">
                        Restricted till {new Date(u.restrictedUntil).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-green-600">Active ✅</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {u.status === "active" && !restricted && (
                        <>
                          <button
                            onClick={() =>
                              act(
                                `http://localhost:3000/api/admin/users/${u._id}/restrict/1d`,
                                "Restricted for 1 day"
                              )
                            }
                            className="action-btn bg-yellow-400 hover:bg-yellow-500"
                            title="Restrict 1 Day"
                          >
                            <FaHourglassHalf />
                          </button>
                          <button
                            onClick={() =>
                              act(
                                `http://localhost:3000/api/admin/users/${u._id}/restrict/7d`,
                                "Restricted for 7 days"
                              )
                            }
                            className="action-btn bg-orange-500 hover:bg-orange-600"
                            title="Restrict 7 Days"
                          >
                            7D
                          </button>
                          <button
                            onClick={() =>
                              act(
                                `http://localhost:3000/api/admin/users/${u._id}/ban`,
                                "User banned",
                                true
                              )
                            }
                            className="action-btn bg-red-600 hover:bg-red-700"
                            title="Ban User"
                          >
                            <FaBan />
                          </button>
                        </>
                      )}

                      {(u.status === "banned" || restricted) && (
                        <button
                          onClick={() =>
                            act(
                              `http://localhost:3000/api/admin/users/${u._id}/unban`,
                              "User unbanned"
                            )
                          }
                          className="action-btn bg-green-600 hover:bg-green-700"
                          title="Unban"
                        >
                          <FaUnlock />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManager;
