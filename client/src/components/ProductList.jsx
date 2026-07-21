
import ProductCard from "./ProductCard";
export const productType = [
        {id:1,name:"IBR", price:6.50},
        {id:2,name:"Q-Tiles",price:7.00},
        {id:3,name:"Ridge Caps",price:10.00},
        {id:4,name:"Chromadek",price:5.90},
    ];
    
function ProductList(){
    
    return(
        <div >
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {productType.map((product) =>
                    <li key={product.id}>
                        <ProductCard id={product.id} name ={product.name} price ={product.price}/>
                        
                    </li>)}
            </ul>
        </div>
    );
}

export default ProductList;