import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/imageUrl";

const corrugateStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    #B9C2C8 0px, #B9C2C8 3px,
    #C9D0D5 3px, #C9D0D5 6px,
    #A9B3B9 6px, #A9B3B9 9px
  )`,
};

function AdminProducts() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", description: "", imageUrl: "" });

  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantForm, setVariantForm] = useState({ measurement: "", price: "", cost: "", stockQty: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }

  // ---- product edit/delete ----

  function startEditing(product) {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      category: product.category,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
  }

  function handleUpdateProduct(id) {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingProductId(null);
        showToast("Product updated", "success");
        fetchProducts();
      });
  }

  function handleDeleteProduct(id) {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        showToast("Product deleted", "success");
        fetchProducts();
      } else {
        return res.json().then((data) => showToast(data.message || "Delete failed", "error"));
      }
    });
  }

  // ---- variant edit/delete ----

  function startEditingVariant(variant) {
    setEditingVariantId(variant.id);
    setVariantForm({
      measurement: variant.measurement,
      price: variant.price,
      cost: variant.cost,
      stockQty: variant.stockQty,
    });
  }

  function handleUpdateVariant(id) {
    fetch(`http://localhost:5000/api/variants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(variantForm),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingVariantId(null);
        showToast("Variant updated", "success");
        fetchProducts();
      });
  }

  function handleDeleteVariant(id) {
    fetch(`http://localhost:5000/api/variants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        showToast("Variant deleted", "success");
        fetchProducts();
      } else {
        return res.json().then((data) => showToast(data.message || "Delete failed", "error"));
      }
    });
  }

  function handleImageUpload(e, callback) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type — the browser sets it automatically
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      callback(data.url);
      showToast('Image uploaded', 'success');
    })
    .catch(() => showToast('Image upload failed', 'error'));
}

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1B42]">Manage Products</h1>
            <p className="text-[#5B6472] text-sm mt-1">Edit product details, pricing and stock</p>
          </div>
          <Link
            to="/add-product"
            className="bg-[#F2601C] hover:bg-[#D9540F] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition"
          >
            + Add Product
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-[#E3E5E0] rounded-xl p-5 shadow-sm">
              {editingProductId === product.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="border border-[#E3E5E0] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <input
                    className="border border-[#E3E5E0] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
                    placeholder="Category"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  />
                  <textarea
                    className="border border-[#E3E5E0] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1B42]/20"
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <div className="flex items-center gap-3">
  {editForm.imageUrl && (
    <img src={resolveImageUrl(editForm.imageUrl)} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-[#E3E5E0]" />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, (url) => setEditForm({ ...editForm, imageUrl: url }))}
    className="text-sm text-[#5B6472]"
  />
</div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className="bg-[#4E9B02] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#427F02] transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProductId(null)}
                      className="bg-[#F7F7F5] border border-[#E3E5E0] text-[#5B6472] text-sm px-4 py-1.5 rounded-full hover:bg-[#E3E5E0] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
  <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-[#E3E5E0] shrink-0" />
) : (
  <div style={corrugateStyle} className="w-14 h-14 rounded-lg border border-[#E3E5E0] shrink-0"></div>
)}
                  <div className="flex-1">
                    <p className="font-semibold text-[#14171C]">{product.name}</p>
                    <p className="text-sm text-[#5B6472]">{product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="text-sm bg-[#0B1B42]/5 text-[#0B1B42] px-3 py-1.5 rounded-full hover:bg-[#0B1B42]/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-sm bg-[#C23B22]/5 text-[#C23B22] px-3 py-1.5 rounded-full hover:bg-[#C23B22]/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[#E3E5E0] flex flex-col gap-2">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="text-sm">
                    {editingVariantId === variant.id ? (
                      <div className="flex flex-wrap gap-2 items-center bg-[#F7F7F5] p-2 rounded-lg">
                        <input
                          className="border border-[#E3E5E0] rounded p-1.5 text-sm w-24"
                          placeholder="Measurement"
                          value={variantForm.measurement}
                          onChange={(e) => setVariantForm({ ...variantForm, measurement: e.target.value })}
                        />
                        <input
                          className="border border-[#E3E5E0] rounded p-1.5 text-sm w-20"
                          type="number"
                          placeholder="Price"
                          value={variantForm.price}
                          onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                        />
                        <input
                          className="border border-[#E3E5E0] rounded p-1.5 text-sm w-20"
                          type="number"
                          placeholder="Cost"
                          value={variantForm.cost}
                          onChange={(e) => setVariantForm({ ...variantForm, cost: e.target.value })}
                        />
                        <input
                          className="border border-[#E3E5E0] rounded p-1.5 text-sm w-20"
                          type="number"
                          placeholder="Stock"
                          value={variantForm.stockQty}
                          onChange={(e) => setVariantForm({ ...variantForm, stockQty: e.target.value })}
                        />
                        <button
                          onClick={() => handleUpdateVariant(variant.id)}
                          className="bg-[#4E9B02] text-white px-3 py-1.5 rounded-full text-xs hover:bg-[#427F02] transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingVariantId(null)}
                          className="bg-white border border-[#E3E5E0] text-[#5B6472] px-3 py-1.5 rounded-full text-xs hover:bg-[#E3E5E0] transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-[#14171C]">
                          {variant.measurement} — ${variant.price.toFixed(2)}
                          <span className="text-[#5B6472]"> · stock: {variant.stockQty}</span>
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingVariant(variant)}
                            className="text-xs bg-[#0B1B42]/5 text-[#0B1B42] px-2.5 py-1 rounded-full hover:bg-[#0B1B42]/10 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="text-xs bg-[#C23B22]/5 text-[#C23B22] px-2.5 py-1 rounded-full hover:bg-[#C23B22]/10 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;