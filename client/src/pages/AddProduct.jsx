import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AddProduct() {
    const {token} = useAuth();
    const [name, setName] = useState('');
    const [price,setPrice] = useState('');
    const [stockQty, setStockQty] = useState('');

    function handleSubmit(e){
        {/**e.preventDefault() — HTML forms want to fully reload the page and submit the old-fashioned way by default; this stops that so your JS handleSubmit can run instead. */}
        e.preventDefault();
        {/** headers: { 'Content-Type': 'application/json' } — tells the server "the body I'm sending is JSON," matching what express.json() expects to parse
             body: JSON.stringify({...}) — fetch only sends strings/binary, not JS objects directly,
              so JSON.stringify converts your object into a JSON string first (the mirror image of res.json() parsing it back out on the server)*/}
        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`},
                 
            body: JSON.stringify({name,price,stockQty}),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log('Created:' ,data);
            setName('');
            setPrice('');
            setStockQty('');
        });
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 max-w-sm">
            <input
            className="border p-2 rounded"
            placeholder="Name"
            value={name} //tied to a state variable
            onChange={(e) => setName(e.target.value)} //updates the state on every key stroke
            />

             <input
            className="border p-2 rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />

             <input
            className="border p-2 rounded"
            placeholder="Stock Quantity"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            />

            <button className="bg-slate-700 text-white rounded px-4 py-2" type="submit">
                Add Product</button>
            

        </form>
    );

}

export default AddProduct;