import { useState } from "react";
import { Link } from 'react-router-dom';
{/**this component takes input called props
    we will reuse ProductCard for every product */}
function ProductCard({id,name,price}){
    const [count, setCount] = useState(0);

    return(
        <div className="p-4 bg-slate-950 rounded-lg m-4 gap-2 border-2 shadow-md hover:bg-slate-900 hover:border-slate-400">
            <h3 className="text-slate-50 text-lg font-bold"><Link to={`/products/${id}`}>{id}. {name}</Link> </h3>
            <h4 className="text-slate-50 text-sm ">Price - ${price}</h4>
            <button className="text-slate-100 bg-slate-700 rounded-xl px-4 py-2 hover:bg-slate-400 shadow-md w-32" onClick={()=> setCount(count + 1)}>
                Add to Cart</button>
            <p className="text-slate-50">Added: {count} times</p>
            {/**since state is local,each component instance ie click add
             * to cart wont change the others - thats state isolation
             */}
        </div>
    );
}

export default ProductCard;
