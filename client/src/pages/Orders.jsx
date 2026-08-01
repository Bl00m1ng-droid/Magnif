import {useState, useEffect} from "react";
import {useAuth} from "../context/AuthContext";

function Orders() {
    const {token} = useAuth();
    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/orders/my-orders",{
            headers:{
                "Authorization": `Bearer ${token}`
            },
        })
        .then(res => res.json())
        .then(data => {
            setOrders(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });
    }, [token]);

    if(loading) return <p className="p-8">Loading orders...</p>;
    if(orders.length === 0) return <p className="p-8">You have no orders yet.</p>;

    return(
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;