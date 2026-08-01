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
    return <h1 className="text-2xl font-bold p-4">Your shopping cart is empty</h1>;
  }

  function handleCheckout(){
    const orderItems = cartItems.map(item => ({
      productVariantId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    fetch("http://localhost:5000/api/orders",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({deliveryAddress,items:orderItems}),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Order placed:", data);
      clearCart();
      navigate("/orders");
    })
    .catch(error => {
      console.error("Error creating order:", error);
    });
  }


  
return (
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="flex flex-col gap-3">
        {cartItems.map((item) =>(
          <li key={item.id}
              className="flex justify-between items-center bg-slate-800 text-slate-50 p-4 rounded-lg">

                <span>{item.name} - $ {item.price}  × {item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">
                    Remove
                </button>

          </li>
        ))}

      </ul>
      <p className="text-xl font-bold mt-4 text-amber-400">Total: ${total.toFixed(2)}</p>

      <input className="border p-2 rounded mt-4 w-full max-w-sm"
      placeholder="Enter delivery address"
      value={deliveryAddress}
      onChange={(e) => setDeliveryAddress(e.target.value)}
      /> 
      <button onClick={handleCheckout}
      className="bg-slate-700 text-white px-4 py-2 rounded mt-4 block hover:bg-slate-600 transition">
        Checkout
      </button>

    </div>
  

);
}

export default Cart;