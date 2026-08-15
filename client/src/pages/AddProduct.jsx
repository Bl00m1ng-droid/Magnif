import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/imageUrl"; // import your utility

function AddProduct() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([{ measurement: "", price: "", stockQty: "" }]);
  const [imageUrl, setImageUrl] = useState("");

  // Step 1: Upload image
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast(data.message || "Image upload failed.", "error");
      }
    } catch {
      showToast("Image upload failed.", "error");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !description.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!imageUrl) {
      showToast("Please upload a product image.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, category, description, variants, imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Product added successfully!", "success");
        setName("");
        setCategory("");
        setDescription("");
        setVariants([{ measurement: "", price: "", stockQty: "" }]);
        setImageUrl("");
      } else {
        showToast(data.message || "Failed to add product.", "error");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-8 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 sm:p-8 md:p-10 w-full max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B42] mb-6 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border border-[#E3E5E0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border border-[#E3E5E0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <textarea
            className="border border-[#E3E5E0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image uploader with preview */}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-[#E3E5E0] p-2 rounded-lg bg-white cursor-pointer"
            />
            {imageUrl && (
              <img
                src={resolveImageUrl(imageUrl)} // use your utility to resolve URL
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-[#E3E5E0] shadow-sm"
              />
            )}
          </div>

          {/* Variants */}
          {variants.map((variant, index) => (
            <div key={index} className="flex flex-col gap-2 border border-[#E3E5E0] p-3 rounded-lg bg-[#F9F9F7]">
              <input
                className="border border-[#E3E5E0] p-2 rounded-lg"
                placeholder="Measurement"
                value={variant.measurement}
                onChange={(e) => {
                  const updated = variants.map((v, i) =>
                    i === index ? { ...v, measurement: e.target.value } : v
                  );
                  setVariants(updated);
                }}
              />
              <input
                className="border border-[#E3E5E0] p-2 rounded-lg"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => {
                  const updated = variants.map((v, i) =>
                    i === index ? { ...v, price: e.target.value } : v
                  );
                  setVariants(updated);
                }}
              />
              <input
                className="border border-[#E3E5E0] p-2 rounded-lg"
                placeholder="Stock Quantity"
                value={variant.stockQty}
                onChange={(e) => {
                  const updated = variants.map((v, i) =>
                    i === index ? { ...v, stockQty: e.target.value } : v
                  );
                  setVariants(updated);
                }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setVariants([...variants, { measurement: "", price: "", stockQty: "" }])}
            className="text-sm text-[#0B1B42] hover:text-[#F2601C] underline self-start"
          >
            + Add Variant
          </button>

          <button
            className="bg-[#0B1B42] hover:bg-[#14295C] text-white rounded-full px-6 py-3 font-semibold transition duration-200"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
