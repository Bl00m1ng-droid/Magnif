import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function AdminUsers() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }

  function handleRoleChange(userId, newRole) {
    fetch(`http://localhost:5000/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    }).then((res) => {
      if (res.ok) {
        showToast(newRole === "admin" ? "User promoted to admin" : "Admin access removed", "success");
        fetchUsers();
      } else {
        return res.json().then((data) => showToast(data.message, "error"));
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0B1B42]">Manage Users</h1>
          <p className="text-[#5B6472] text-sm mt-1">Promote or remove admin access</p>
        </div>

        <div className="bg-white border border-[#E3E5E0] rounded-xl divide-y divide-[#E3E5E0]">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-[#14171C]">{u.name}</p>
                <p className="text-sm text-[#5B6472]">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    u.role === "admin" ? "bg-[#F2601C]/10 text-[#F2601C]" : "bg-[#5B6472]/10 text-[#5B6472]"
                  }`}
                >
                  {u.role}
                </span>
                <button
                  onClick={() => handleRoleChange(u.id, u.role === "admin" ? "registered" : "admin")}
                  className="text-sm bg-[#0B1B42]/5 text-[#0B1B42] px-3 py-1.5 rounded-full hover:bg-[#0B1B42]/10 transition"
                >
                  {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;