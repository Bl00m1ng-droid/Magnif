{/**useParams() - returns an object containing every named parameter
    from the route path
    the value from useParams is always a string eg"2" */}
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails(){
    const {id} = useParams();{/**it pulls the
        id field out of that returned object into its own variable */}
   
    const [product,setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const {addToCart} = useCart();

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
      <div className="w-64 h-64 bg-slate-800 rounded-lg"></div>
      <div>
        <p className="text-slate-900 text-2xl font-bold">{product.name}</p>
        <p className="text-slate-900">{product.description}</p>

        <div className="mt-4 flex flex-col gap-3">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between bg-slate-800 p-3 rounded-lg"
            >
              <span className="text-slate-50">
                {variant.measurement}mm — ${variant.price.toFixed(2)}/m
              </span>
              <button
                className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600"
                onClick={() =>
                  addToCart({
                    id: variant.id,
                    name: `${product.name} (${variant.measurement})`,
                    price: variant.price,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;


