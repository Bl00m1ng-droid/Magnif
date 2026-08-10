import {useState,useEffect} from 'react';
import {useAuth} from "../context/AuthContext";

function AdminDashboard(){
    const {token} = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    function fetchOrders(){
        fetch("http://localhost:5000/api/orders/all",{
            headers:{'Authorization': `Bearer ${token}`},
        })
        .then(res => res.json())
        .then(data => {
            setOrders(data);
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
        });
    }

    function fetchStats() {
    fetch('http://localhost:5000/api/stats', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }

    function handleStatusChange(orderId, newStatus){
        fetch(`http://localhost:5000/api/orders/${orderId}/delivery-status`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ deliveryStatus: newStatus })
        })
        .then((res) => res.json())
        .then(() => fetchOrders());
        
    }

    return(
        <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-50 mb-4">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <p className="text-slate-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <p className="text-slate-400 text-sm">Revenue (paid orders)</p>
            <p className="text-2xl font-bold text-amber-400">${stats.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <p className="text-slate-400 text-sm">Profit</p>
            <p className="text-2xl font-bold text-green-400">${stats.profit.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <p className="text-slate-400 text-sm">Stock Value</p>
            <p className="text-2xl font-bold">${stats.totalStockValue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {stats && stats.lowStockVariants.length > 0 && (
        <div className="bg-amber-900 p-4 rounded-lg mb-8 text-slate-50">
          <h3 className="font-bold mb-2">⚠ Low Stock</h3>
          <ul>
            {stats.lowStockVariants.map((v) => (
              <li key={v.id}>{v.name} ({v.measurement}) — only {v.stockQty} left</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-50 mb-2">All Orders</h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <div className="flex justify-between">
              <span>Order #{order.id} — {order.user.name} ({order.user.email})</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <p>Payment: {order.paymentStatus} | Address: {order.deliveryAddress}</p>
            <ul className="mt-1 text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productVariant.product.name} ({item.productVariant.measurement}) × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-2">
              <label>Delivery status:</label>
              <select
                value={order.deliveryStatus}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="text-black rounded p-1"
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
  );
  
}

export default AdminDashboard;



