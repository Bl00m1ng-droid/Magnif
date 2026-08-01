{/**useParams() - returns an object containing every named parameter
    from the route path
    the value from useParams is always a string eg"2" */}
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails(){
    const {id} = useParams();{/**it pulls the
        id field out of that returned object into its own variable */}
    const [product,setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const {addToCart} = useCart();
    const {token ,user} = useAuth();

    const [rating,setRating] = useState(5);
    const [comment,setComment] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);{/**this time the dependency array is not empty
        it tells react to re-run this effect whnever id changes */}

    function fetchProduct(){
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setProduct(data);
            setLoading(false);
        });

    }

    function handleReviewSubmit(e){
        e.preventDefault();
        fetch("http://localhost:5000/api/reviews",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: product.id,
                rating,
                comment
            }),
        })
        .then(res => res.json())
        .then(data => {
           setComment('');
           setRating(5);
           fetchProduct(); // Refresh product details to show the new review
        });
    }

    if(loading) return <p>Loading...</p>;
    if(!product || product.message === "Product not found"){
        return <p>Product not found.</p>;}

     return (
    <div className="p-8">
      <div className="flex gap-6">
        <div className="w-64 h-64 bg-slate-800 rounded-lg"></div>
        <div>
          <p className="text-slate-50 text-2xl font-bold">{product.name}</p>
          <p className="text-slate-300">{product.description}</p>

          <div className="mt-4 flex flex-col gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-50">{variant.measurement} — ${variant.price.toFixed(2)}</span>
                <button
                  className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600"
                  onClick={() => addToCart({ id: variant.id, name: `${product.name} (${variant.measurement})`, price: variant.price })}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-lg">
        <h3 className="text-xl font-bold text-slate-50 mb-3">Reviews</h3>

        {product.reviews.length === 0 && <p className="text-slate-400">No reviews yet.</p>}

        <div className="flex flex-col gap-3 mb-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="bg-slate-800 p-3 rounded-lg">
              <p className="text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <p className="text-slate-50">{review.comment}</p>
              <p className="text-slate-400 text-sm">— {review.user.name}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2">
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2 rounded">
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Bad</option>
            </select>
            <textarea
              className="border p-2 rounded"
              placeholder="Write a review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="bg-slate-700 text-white rounded px-4 py-2" type="submit">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-slate-400">Log in to leave a review.</p>
        )}
      </div>
    </div>
  );
}


export default ProductDetails;  