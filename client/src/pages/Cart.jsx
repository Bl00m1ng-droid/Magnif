import { useCart } from "../context/CartContext";

function Cart() {
  const {cartItems,removeFromCart} = useCart();

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

    </div>
  

);
}

export default Cart;