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
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:border-orange-300">
      
      {/* Product Name */}
      <h3 className="text-slate-50 text-2xl font-bold mb-2 tracking-wide">
        {name}
      </h3>
      
      {/* Price */}
      <h4 className="text-orange-400 text-lg font-semibold mb-3">
        {lowestPrice !== null 
          ? `From $${lowestPrice.toFixed(2)}` 
          : "Price unavailable"}
      </h4>
      
      {/* Description */}
      <p className="text-slate-300 italic text-sm leading-relaxed">
        {description || "No description available."}
      </p>
    </div>
  </Link>
  );
}

export default ProductCard;
