import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

  const handleDelete = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`http://localhost:3000/api/product/admin/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDashboard(); // reload updated product list
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

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

  if (loading) return <p>Loading users…</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const restricted =
              u.restrictedUntil && new Date(u.restrictedUntil) > Date.now();

            return (
              <tr key={u._id} className="border-b">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.status === "banned"
                    ? "Banned"
                    : restricted
                    ? `Restricted until ${new Date(
                        u.restrictedUntil
                      ).toLocaleDateString()}`
                    : "Active"}
                </td>
                <td className="flex gap-2 py-1 flex-wrap">
                  {/* Restrict buttons (only if active) */}
                  {u.status === "active" && !restricted && (
                    <>
                      <button
                        onClick={() =>
                          act(
                            `http://localhost:3000/api/admin/users/${u._id}/restrict/1d`,
                            "Restricted 1 day"
                          )
                        }
                        className="bg-yellow-500 text-white px-2 rounded"
                      >
                        1 Day
                      </button>
                      <button
                        onClick={() =>
                          act(
                            `http://localhost:3000/api/admin/users/${u._id}/restrict/7d`,
                            "Restricted 7 days"
                          )
                        }
                        className="bg-orange-500 text-white px-2 rounded"
                      >
                        7 Days
                      </button>
                      <button
                        onClick={() =>
                          act(
                            `http://localhost:3000/api/admin/users/${u._id}/ban`,
                            "User banned",
                            true
                          )
                        }
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        Ban
                      </button>
                    </>
                  )}

                  {/* Unban button (only if banned or restricted) */}
                  {(u.status === "banned" || restricted) && (
                    <button
                      onClick={() =>
                        act(
                          `http://localhost:3000/api/admin/users/${u._id}/unban`,
                          "User unbanned"
                        )
                      }
                      className="bg-green-600 text-white px-2 rounded"
                    >
                      Unban
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
  onClick={() => handleDelete(product._id)}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Delete
</button>

    </div>
  );
};

export default AdminUserManager;
