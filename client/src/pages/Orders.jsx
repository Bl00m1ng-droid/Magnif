import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

function fetchOrders() {
    fetch('http://localhost:5000/api/orders/my-orders', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token]);

function checkPayment(orderId) {
    fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          fetchOrders();
        } else {
          alert("Payment not confirmed yet — try again shortly.");
        }
      });
  }

function orderTotal(order) {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

  if (loading) return <p className="p-8">Loading orders...</p>;
  if (!Array.isArray(orders)) return <p className="p-8">Something went wrong loading orders.</p>;
  if (orders.length === 0) return <p className="p-8">You have no orders yet.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-800 p-4 rounded-lg text-slate-50">
            <div className="flex justify-between">
              <span>Order #{order.id}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <p>Status: {order.status} | Payment: {order.paymentStatus} | Delivery: {order.deliveryStatus}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productVariant.product.name} ({item.productVariant.measurement}) × {item.quantity} — ${item.price}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold text-amber-400">Total: ${orderTotal(order).toFixed(2)}</p>
            {order.paymentStatus !== 'paid' && (
              <button
                onClick={() => checkPayment(order.id)}
                className="bg-amber-600 text-white px-3 py-1 rounded mt-2"
              >
                Check payment status
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;