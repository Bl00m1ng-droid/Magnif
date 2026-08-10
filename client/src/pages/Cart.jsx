import { useCart } from "../context/CartContext";
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
 
function Cart() {
  const {cartItems,removeFromCart,clearCart} = useCart();
  const {token} = useAuth();
  const [deliveryAddress,setDeliveryAddress] = useState("");
  const navigate = useNavigate();
 
  {/**const items = [
  {id:1,name:"IBR", price:6.50,quantity:10},
  {id:2,name:"Q-Tiles",price:7.00,quantity:60},
  {id:3,name:"Ridge Caps",price:10.00,quantity:200},
  {id:4,name:"Chromadek",price:5.90,quantity:35},
  ];**/}
 
  const total = cartItems.reduce((sum,item) => sum +(item.price * item.quantity),0);
  if(cartItems.length === 0){
    return (
      <div className="min-h-screen bg-[#F3F1EC] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1B1F23] mb-2">Your shopping cart is empty</h1>
          <p className="text-[#4A5560] mb-6">Browse our IBR, Chromadek and Q-Tile sheeting to get started.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#E2932E] hover:bg-[#cf8324] text-[#1B1F23] font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
 
function handleCheckout() {
  console.log("Checkout clicked");
  const orderItems = cartItems.map((item) => ({
    productVariantId: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ deliveryAddress, items: orderItems }),
  })
    .then((res) => res.json())
    .then((order) => {
      clearCart();
      return fetch(`http://localhost:5000/api/payments/initiate/${order.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Payment init response:", data);
      window.location.href = data.redirectUrl; // send the user to Paynow's payment page
    });
}
 
 
  
return (
    
    <div className="min-h-screen bg-[#F3F1EC] p-8">
      <h1 className="text-2xl font-bold mb-4 text-[#1B1F23]">Your Cart</h1>
      <ul className="flex flex-col gap-3">
        {cartItems.map((item) =>(
          <li key={item.id}
              className="flex justify-between items-center bg-white border border-[#E4E0D6] text-[#1B1F23] p-4 rounded-lg shadow-sm">
 
                <span>{item.name} - $ {item.price}  × {item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}
                  className="border border-red-300 text-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition">
                    Remove
                </button>
 
          </li>
        ))}
 
      </ul>
      <p className="text-xl font-bold mt-4 text-[#E2932E]">Total: ${total.toFixed(2)}</p>
 
      <input className="border border-[#E4E0D6] bg-white text-[#1B1F23] p-2 rounded-lg mt-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-[#E2932E]"
      placeholder="Enter delivery address"
      value={deliveryAddress}
      onChange={(e) => setDeliveryAddress(e.target.value)}
      /> 
      <button onClick={handleCheckout}
      className="bg-[#E2932E] hover:bg-[#cf8324] text-[#1B1F23] font-semibold px-6 py-3 rounded-full mt-4 block shadow-md transition">
        Checkout
      </button>
 
    </div>
  
 
);
}
 
export default Cart;
 
