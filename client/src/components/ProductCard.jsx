import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl";

const corrugateStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    #B9C2C8 0px, #B9C2C8 3px,
    #C9D0D5 3px, #C9D0D5 6px,
    #A9B3B9 6px, #A9B3B9 9px
  )`,
};

function ProductCard({ id, name, description, imageUrl, variants }) {
  const lowestPrice =
    variants && variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : null;

  return (
    <Link to={`/products/${id}`} className="block">
      <div className="bg-white rounded-xl border border-[#E3E5E0] shadow-sm overflow-hidden transition hover:shadow-md hover:border-[#F2601C]/40">
        {imageUrl ? (
          <img src={resolveImageUrl(imageUrl)} alt={name} className="w-full h-80 object-cover" />
        ) : (
          <div style={corrugateStyle} className="w-full h-40"></div>
        )}

        <div className="p-4">
          <h3 className="text-[#14171C] text-lg font-bold">{name}</h3>
          <p className="text-[#F2601C] font-semibold text-sm mt-1">
            {lowestPrice !== null ? `From $${lowestPrice.toFixed(2)}` : "Price unavailable"}
          </p>
          <p className="text-[#5B6472] text-sm mt-2 line-clamp-2">
            {description || "No description available."}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;