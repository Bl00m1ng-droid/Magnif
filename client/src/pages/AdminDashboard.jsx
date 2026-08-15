import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function getPaymentBadge(status) {
  const styles = {
    paid: "bg-[#4E9B02]/10 text-[#4E9B02] border border-[#4E9B02]/30",
    unpaid: "bg-[#C23B22]/10 text-[#C23B22] border border-[#C23B22]/30",
  };
  return styles[status] || "bg-gray-100 text-gray-600 border border-gray-200";
}

function getDeliveryBadge(status) {
  const styles = {
    processing: "bg-[#5B6472]/10 text-[#5B6472] border border-[#5B6472]/30",
    shipped: "bg-[#F2601C]/10 text-[#F2601C] border border-[#F2601C]/30",
    "out for delivery": "bg-[#F2601C]/10 text-[#F2601C] border border-[#F2601C]/30",
    delivered: "bg-[#4E9B02]/10 text-[#4E9B02] border border-[#4E9B02]/30",
  };
  return styles[status] || "bg-gray-100 text-gray-600 border border-gray-200";
}

function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  function fetchOrders() {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }

  function fetchStats() {
    fetch(`${import.meta.env.VITE_API_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }

  function handleStatusChange(orderId, newStatus) {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/delivery-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deliveryStatus: newStatus }),
    })
      .then((res) => res.json())
      .then(() => fetchOrders());
  }
const [statementMonth, setStatementMonth] = useState(new Date().getMonth() + 1);
const [statementYear, setStatementYear] = useState(new Date().getFullYear());

function downloadStatement() {
  fetch(`${import.meta.env.VITE_API_URL}/api/stats/monthly/download?month=${statementMonth}&year=${statementYear}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `magnif-statement-${statementMonth}-${statementYear}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
}

const [users, setUsers] = useState([]);

useEffect(() => {
  fetchOrders();
  fetchStats();
  fetchUsers();
}, []);

function fetchUsers() {
  fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setUsers(data));
}

function handleRoleChange(userId, newRole) {
  fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ role: newRole }),
  })
    .then((res) => {
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1B42]">Admin Dashboard</h1>
            <p className="text-[#5B6472] text-sm mt-1">Overview of orders, stock and business performance</p>
          </div>
         <div className="flex gap-3 mb-6">
  <Link
    to="/admin/products"
    className="bg-white border border-[#E3E5E0] text-[#0B1B42] text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:border-[#F2601C] hover:text-[#F2601C] transition"
  >
    Manage Products →
  </Link>
  <Link
    to="/admin/users"
    className="bg-white border border-[#E3E5E0] text-[#0B1B42] text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:border-[#F2601C] hover:text-[#F2601C] transition"
  >
    Manage Users →
  </Link>
</div>
        </div>
        

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#0B1B42]/10 flex items-center justify-center mb-3">
                <span className="text-[#0B1B42] font-bold text-sm">#</span>
              </div>
              <p className="text-[#5B6472] text-xs font-medium uppercase tracking-wide">Total Orders</p>
              <p className="text-2xl font-bold text-[#14171C] mt-1">{stats.totalOrders}</p>
            </div>

            <div className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#F2601C]/10 flex items-center justify-center mb-3">
                <span className="text-[#F2601C] font-bold text-sm">$</span>
              </div>
              <p className="text-[#5B6472] text-xs font-medium uppercase tracking-wide">Revenue (paid)</p>
              <p className="text-2xl font-bold text-[#F2601C] mt-1">${stats.revenue.toFixed(2)}</p>
            </div>

            <div className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#4E9B02]/10 flex items-center justify-center mb-3">
                <span className="text-[#4E9B02] font-bold text-sm">↑</span>
              </div>
              <p className="text-[#5B6472] text-xs font-medium uppercase tracking-wide">Profit</p>
              <p className="text-2xl font-bold text-[#4E9B02] mt-1">${stats.profit.toFixed(2)}</p>
            </div>

            <div className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#0B1B42]/10 flex items-center justify-center mb-3">
                <span className="text-[#0B1B42] font-bold text-sm">▤</span>
              </div>
              <p className="text-[#5B6472] text-xs font-medium uppercase tracking-wide">Stock Value</p>
              <p className="text-2xl font-bold text-[#14171C] mt-1">${stats.totalStockValue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {stats && stats.lowStockVariants.length > 0 && (
          <div className="bg-[#F2601C]/5 border-l-4 border-[#F2601C] rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-[#F2601C] mb-2 text-sm flex items-center gap-2">
              <span>⚠</span> Low Stock — {stats.lowStockVariants.length} item{stats.lowStockVariants.length > 1 ? "s" : ""} need reordering
            </h3>
            <ul className="text-sm text-[#14171C] flex flex-col gap-1">
              {stats.lowStockVariants.map((v) => (
                <li key={v.id} className="flex justify-between max-w-md">
                  <span>{v.name} ({v.measurement})</span>
                  <span className="text-[#F2601C] font-medium">{v.stockQty} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}
         <div className="flex items-center justify-center gap-2 bg-white border border-[#E3E5E0] rounded-full px-4 py-2 shadow-sm mb-4">
          <h1 className="m-4 font-bold text-slate-900 text-lg">Download Monthly Statement:</h1>
  <select value={statementMonth} onChange={(e) => setStatementMonth(e.target.value)} className="text-sm border-none focus:outline-none">
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
    ))}
  </select>
  <select value={statementYear} onChange={(e) => setStatementYear(e.target.value)} className="text-sm border-none focus:outline-none">
    {[2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
  </select>
  <button onClick={downloadStatement} className="bg-[#0B1B42] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#14295C] transition">
    Download PDF
  </button>
</div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#0B1B42]">All Orders</h2>
          <span className="text-xs text-[#5B6472] bg-white border border-[#E3E5E0] rounded-full px-3 py-1">
            {orders.length} total
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div>
                  <p className="font-semibold text-[#14171C]">Order #{order.id}</p>
                  <p className="text-sm text-[#5B6472]">{order.user.name} · {order.user.email}</p>
                </div>
                <span className="text-xs text-[#5B6472]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPaymentBadge(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDeliveryBadge(order.deliveryStatus)}`}>
                  {order.deliveryStatus}
                </span>
              </div>

              <p className="text-sm text-[#5B6472] mb-2">{order.deliveryAddress}</p>

              <ul className="text-sm text-[#14171C] border-t border-[#E3E5E0] pt-2 flex flex-col gap-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.productVariant.product.name} ({item.productVariant.measurement})</span>
                    <span className="text-[#5B6472]">× {item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-2">
                <label className="text-sm text-[#5B6472]">Delivery status:</label>
                <select
                  value={order.deliveryStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="text-sm border border-[#E3E5E0] rounded-lg px-2 py-1.5 text-[#14171C] focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
         
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;