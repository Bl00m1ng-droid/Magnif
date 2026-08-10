
{/**useParams() - returns an object containing every named parameter
    from the route path
    the value from useParams is always a string eg"2" */}
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
 
// Corrugated-sheet motif — same signature element used across Home and
// ServicesSection, used here as the product image placeholder.
const corrugateStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    #B9C2C8 0px, #B9C2C8 3px,
    #C9D0D5 3px, #C9D0D5 6px,
    #A9B3B9 6px, #A9B3B9 9px
  )`,
};
 
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
 
    if(loading) return <p className="p-8 text-[#4A5560]">Loading...</p>;
    if(!product || product.message === "Product not found"){
        return <p className="p-8 text-[#4A5560]">Product not found.</p>;}
 
     return (
    <div className="min-h-screen bg-[#F3F1EC] p-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div
          style={corrugateStyle}
          className="w-64 h-64 rounded-xl border border-[#E4E0D6] shadow-md shrink-0"
        ></div>
        <div>
          <p className="text-[#1B1F23] text-2xl font-bold">{product.name}</p>
          <p className="text-[#4A5560] mt-1">{product.description}</p>
 
          <div className="mt-4 flex flex-col gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between bg-white border border-[#E4E0D6] p-3 rounded-lg shadow-sm">
                <span className="text-[#1B1F23] font-medium">{variant.measurement} — ${variant.price.toFixed(2)}</span>
                <button
                  className="bg-[#1B1F23] text-white px-4 py-2 rounded-full hover:bg-[#E2932E] hover:text-[#1B1F23] transition"
                  onClick={() => addToCart({ id: variant.id, name: `${product.name} (${variant.measurement})`, price: variant.price })}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      <div className="mt-10 max-w-lg">
        <h3 className="text-xl font-bold text-[#1B1F23] mb-3">Reviews</h3>
 
        {product.reviews.length === 0 && <p className="text-[#4A5560]">No reviews yet.</p>}
 
        <div className="flex flex-col gap-3 mb-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="bg-white border border-[#E4E0D6] p-3 rounded-lg shadow-sm">
              <p className="text-[#E2932E]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <p className="text-[#1B1F23]">{review.comment}</p>
              <p className="text-[#8A9199] text-sm">— {review.user.name}</p>
            </div>
          ))}
        </div>
 
        {user ? (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border border-[#E4E0D6] bg-white text-[#1B1F23] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2932E]"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Bad</option>
            </select>
            <textarea
              className="border border-[#E4E0D6] bg-white text-[#1B1F23] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2932E]"
              placeholder="Write a review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="bg-[#1B1F23] text-white rounded-full px-4 py-2 hover:bg-[#E2932E] hover:text-[#1B1F23] transition" type="submit">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-[#4A5560]">Log in to leave a review.</p>
        )}
      </div>
    </div>
  );
}
 
 
export default ProductDetails;
 
