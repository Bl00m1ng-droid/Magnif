import { useState, useEffect } from "react";
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

function Orders() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState(null);

  function fetchOrders() {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
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
    setCheckingId(orderId);
    fetch(`${import.meta.env.VITE_API_URL}/api/payments/status/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCheckingId(null);
        if (data.paid) {
          showToast("Payment confirmed!", "success");
          fetchOrders();
        } else {
          showToast("Payment not confirmed yet — try again shortly.", "info");
        }
      })
      .catch(() => {
        setCheckingId(null);
        showToast("Could not check payment status right now.", "error");
      });
  }

  function orderTotal(order) {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center text-[#5B6472]">Loading orders...</div>;
  }
  if (!Array.isArray(orders)) {
    return <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center text-[#C23B22]">Something went wrong loading orders.</div>;
  }
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#14171C] mb-2">No orders yet</h1>
          <p className="text-[#5B6472] text-sm">Your order history will show up here once you check out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0B1B42] mb-6">Your Orders</h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <p className="font-semibold text-[#14171C]">Order #{order.id}</p>
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

              <ul className="text-sm text-[#14171C] border-t border-[#E3E5E0] pt-3 flex flex-col gap-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.productVariant.product.name} ({item.productVariant.measurement}) × {item.quantity}</span>
                    <span className="text-[#5B6472]">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E3E5E0]">
                <span className="font-bold text-[#F2601C]">Total: ${orderTotal(order).toFixed(2)}</span>

                {order.paymentStatus !== "paid" && (
                  <button
                    onClick={() => checkPayment(order.id)}
                    disabled={checkingId === order.id}
                    className="text-sm bg-[#0B1B42] hover:bg-[#14295C] text-white px-4 py-1.5 rounded-full transition disabled:opacity-50"
                  >
                    {checkingId === order.id ? "Checking..." : "Check payment status"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;