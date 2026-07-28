{/**useParams() - returns an object containing every named parameter
    from the route path
    the value from useParams is always a string eg"2" */}
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";

function ProductDetails(){
    const {id} = useParams();{/**it pulls the
        id field out of that returned object into its own variable */}
   
    const [product,setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setProduct(data);
            setLoading(false);
        });
    }, [id]);{/**this time the dependency array is not empty
        it tells react to re-run this effect whnever id changes */}

    if(loading) return <p>Loading...</p>;
    if(!product || product.message === "Product not found"){
        return <p>Product not found.</p>;}

    return (
        
        <div className="flex p-8 gap-6">
            <div className="w-64 h-64 bg-slate-800 rounded-lg text-slate-50"></div>
            <div>
                    <p className="text-slate-500 text-2xl font-bold">{product.name}</p>
                    <p className="text-xl text-amber-400">Price: ${product.price}</p>
                    <p>Durable, weather-resistant roofing </p>
                    <button className="text-slate-100 bg-slate-700 rounded-xl px-4 py-2 hover:bg-slate-400 shadow-md w-32" >
                Add to Cart</button>

            </div>
                
            
        </div>
    );
}

export default ProductDetails;