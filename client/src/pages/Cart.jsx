function Cart() {

  const items = [
  {id:1,name:"IBR", price:6.50,quantity:10},
  {id:2,name:"Q-Tiles",price:7.00,quantity:60},
  {id:3,name:"Ridge Caps",price:10.00,quantity:200},
  {id:4,name:"Chromadek",price:5.90,quantity:35},
  ];

  const total = items.reduce((sum,item) => sum +(item.price * item.quantity),0);
  
return (
    <>
       <h1 className="text-2xl font-bold p-4">Your Cart</h1>
       <div className="px-10 py-10 bg-slate-700 text-slate-50" >
        {items.map((item)=>
        <ul>
         <li key={item.id}>
          {item.name} - ${item.price} - {item.quantity}
         </li>
         </ul>)}

         <p className="text-xl font-bold m-2 text-amber-400">Total : ${total}</p>
    </div>
    </>
  

);
}

export default Cart;