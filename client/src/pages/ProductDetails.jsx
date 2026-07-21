{/**useParams() - returns an object containing every named parameter
    from the route path
    the value from useParams is always a string eg"2" */}
import { useParams } from "react-router-dom";
import {productType} from "../components/ProductList";

function ProductDetails(){
    const {id} = useParams();{/**it pulls the
        id field out of that returned object into its own variable */}
    const product = productType.find((product)=> product.id === parseInt(id));

    return (
        <div>
            <h3>Product Detail Page</h3>
            <p>Showing product with id: {product.id}</p>
            <p>{product.name}</p>
            <p>{product.price}</p>
        </div>
    );
}

export default ProductDetails;