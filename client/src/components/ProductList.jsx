import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            id={product.id}
            name={product.name}
            description={product.description}
            imageUrl={product.imageUrl}
            variants={product.variants}
          />
        </li>
      ))}
    </ul>
  );
}

export default ProductList;