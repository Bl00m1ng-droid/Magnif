import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Cart() {
  const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleCheckout() {
    if(!token){
      showToast("You must be logged in to checkout.", "error");
    navigate("/login");
    return;
    }

    if (!deliveryAddress.trim()) {
      showToast("Please enter a delivery address", "error");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productVariantId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deliveryAddress, items: orderItems }),
    })
      .then((res) => res.json())
      .then((order) => {
        clearCart();
        return fetch(`http://localhost:5000/api/payments/initiate/${order.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          showToast("Could not start payment. Please try again.", "error");
        }
      }).catch(() =>{showToast("Checkout failed. Please try again.", "error");

      });
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#0B1B42]/5 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-xl font-bold text-[#14171C] mb-2">Your cart is empty</h1>
          <p className="text-[#5B6472] text-sm mb-6">Browse our IBR, Chromadek and Q-Tile sheeting to get started.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#F2601C] hover:bg-[#D9540F] text-white font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0B1B42] mb-6">Your Cart</h1>

        <div className="flex flex-col gap-3 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E3E5E0] rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-[#14171C]">{item.name}</p>
                <p className="text-sm text-[#5B6472]">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E3E5E0] rounded-full">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-[#5B6472] hover:text-[#F2601C] transition"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-[#14171C]">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-[#5B6472] hover:text-[#4E9B02] transition"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-[#0B1B42] w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    showToast(`Removed ${item.name}`, "info");
                  }}
                  className="text-[#C23B22] text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E3E5E0]">
            <span className="text-[#5B6472]">Total</span>
            <span className="text-2xl font-bold text-[#F2601C]">${total.toFixed(2)}</span>
          </div>

          <label className="text-sm font-medium text-[#14171C] mb-1 block">Delivery address</label>
          <input
            className="border border-[#E3E5E0] rounded-lg p-2.5 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
            placeholder="Enter your delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          <button
  onClick={handleCheckout}
  disabled={!token}
  className={`w-full py-3 rounded-full shadow-sm transition font-semibold ${
    token 
      ? "bg-[#0B1B42] hover:bg-[#14295C] text-white" 
      : "bg-gray-400 text-gray-200 cursor-not-allowed"
  }`}
>
  {token ? "Proceed to Checkout" : "Login to Checkout"}
</button>

        </div>
      </div>
    </div>
  );
}

export default Cart;