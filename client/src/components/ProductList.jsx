
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
    
function ProductList(){
    {/**useState([]) -starts out as an empty array,and gets filled when the fetch completes*/}
    const [products, setProducts] = useState([]);

    {/**this function runs once after the components first render */}
    useEffect(() => {
        {/**fetch - returns a Promise that resolves to a raw HTTP response
            .json() - parses the body as JSON
            once you have real data setProducts(data) stores it in a state which triggers a re-render*/}
        fetch('http://localhost:5000/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }, []);{/**this empty array,[],is called the dependency array
        tells react only to re-run this effect if one of these values changes
        without the dependency array an infinite loop would occur since the effect would run after every render
        no dependency array = runs every render, empty array = runs once */}
    
    return(
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) =>
                    <li key={product.id}>
                        <ProductCard id={product.id} name ={product.name} description={product.description} variants={product.variants} />
                        
                    </li>)}
            </ul>
       
    );
}

export default ProductList;