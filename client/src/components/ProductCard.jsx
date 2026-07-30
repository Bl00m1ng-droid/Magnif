import { useState } from "react";
import { Link } from 'react-router-dom';
import {useCart} from "../context/CartContext";

{/**this component takes input called props
    we will reuse ProductCard for every product */}
function ProductCard({id,name,description,variants}){
    const {addToCart} = useCart();
    const lowestPrice = variants && variants.length > 0
    ? Math.min(...variants.map((v) => v.price))
    : null;

    return (
    <Link to={`/products/${id}`}>
    <div className="p-4 bg-slate-950 rounded-lg m-4 gap-2 border-2 shadow-md hover:bg-slate-900 hover:border-slate-400">
      <h3 className="text-slate-50 text-lg font-bold">
        {name}
      </h3>
      <h4 className="text-slate-50 text-sm">
        {lowestPrice !== null ? `From $${lowestPrice.toFixed(2)}` : "Price unavailable"}
      </h4>
      <p className="text-slate-300 text-sm">
        {description || "No description available."}
      </p>
    </div>
    </Link>
  );
}

export default ProductCard;
