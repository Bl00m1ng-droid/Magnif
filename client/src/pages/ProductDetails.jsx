import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { resolveImageUrl } from "../utils/imageUrl";

const corrugateStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    #B9C2C8 0px, #B9C2C8 3px,
    #C9D0D5 3px, #C9D0D5 6px,
    #A9B3B9 6px, #A9B3B9 9px
  )`,
};

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  function fetchProduct() {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: product.id, rating, comment }),
    })
      .then((res) => res.json())
      .then(() => {
        setComment('');
        setRating(5);
        showToast("Review submitted", "success");
        fetchProduct();
      });
  }

  function handleAddToCart(variant) {
    addToCart({ id: variant.id, name: `${product.name} (${variant.measurement})`, price: variant.price });
    showToast(`Added ${product.name} (${variant.measurement}) to cart`, "success");
  }

  if (loading) return <p className="p-8 text-[#5B6472]">Loading...</p>;
  if (!product || product.message === "Product not found") {
    return <p className="p-8 text-[#5B6472]">Product not found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-6 sm:p-8 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center text-[#14171C] hover:text-[#F2601C] transition">
        <ArrowLeftIcon className="h-6 w-6 mr-2" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="flex flex-col items-center justify-center md:flex-row gap-8 pt-16 md:pt-8">
        {product.imageUrl ? (
  <img
    src={resolveImageUrl(product.imageUrl)}
    alt={product.name}
    className="w-64 h-64 md:w-80 md:h-80 rounded-xl border border-[#E3E5E0] shadow-lg shrink-0 object-cover"
  />
) : (
  <div style={corrugateStyle} className="w-64 h-64 md:w-80 md:h-80 rounded-xl border border-[#E3E5E0] shadow-lg shrink-0"></div>
)}

        <div className="max-w-xl">
          <p className="text-[#0B1B42] text-2xl md:text-3xl font-bold">{product.name}</p>
          <p className="text-[#5B6472] mt-2 text-base md:text-lg">{product.description}</p>

          <div className="mt-6 flex flex-col gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between bg-white border border-[#E3E5E0] p-4 rounded-lg shadow-sm">
                <span className="text-[#14171C] font-medium">
                  {variant.measurement} — ${variant.price.toFixed(2)}
                </span>
                <button
                  className="bg-[#0B1B42] text-white px-5 py-2 rounded-full hover:bg-[#F2601C] transition"
                  onClick={() => handleAddToCart(variant)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-xl mx-auto">
        <h3 className="text-xl md:text-2xl font-bold text-[#0B1B42] mb-4">Reviews</h3>

        {product.reviews.length === 0 && <p className="text-[#5B6472]">No reviews yet.</p>}

        <div className="flex flex-col gap-4 mb-8">
          {product.reviews.map((review) => (
            <div key={review.id} className="bg-white border border-[#E3E5E0] p-4 rounded-lg shadow-sm">
              <p className="text-[#F2601C]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <p className="text-[#14171C] mt-1">{review.comment}</p>
              <p className="text-[#5B6472] text-sm mt-1">— {review.user.name}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border border-[#E3E5E0] bg-white text-[#14171C] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Bad</option>
            </select>
            <textarea
              className="border border-[#E3E5E0] bg-white text-[#14171C] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
              placeholder="Write a review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="bg-[#0B1B42] text-white rounded-full px-5 py-2 hover:bg-[#F2601C] transition" type="submit">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-[#5B6472]">Log in to leave a review.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;