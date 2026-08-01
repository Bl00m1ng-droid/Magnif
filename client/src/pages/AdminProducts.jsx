import {useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";

function AdminProducts(){
    const {token} = useAuth();
    const [products,setProducts] = useState([]);
    const [editingProductId,setEditingProductId] = useState(null);
    const [editForm,setEditForm] = useState({name:'',category:'',description:''});
    const [editingVariantId,setEditingVariantId] = useState(null);
    const [variantForm,setVariantForm] = useState({measurement:'',price:'',stockQty:''});

    useEffect(() => {
        fetchProducts();
    },[]);

    function fetchProducts(){
        fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            });
    }

    function handleDeleteProduct(id){
        fetch(`http://localhost:5000/api/products/${id}`,{
            method:"DELETE",
            headers:{
                "Authorization": `Bearer ${token}`
            },
        })
        .then((res) => {
            if (res.ok) {
                fetchProducts(); // Refresh the product list
            }else{
                return res.json().then((data) => alert(data.message || "Failed to delete product"));
            }
        });
    }

    function handleDeleteVariant(variantId) {
        fetch(`http://localhost:5000/api/variants/${variantId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        fetchProducts(); // refresh so the deleted variant disappears from the list
      } else {
        return res.json().then((data) => alert(data.message || "Delete failed"));
      }
    });
    }

    function startEditing(product){
        setEditingProductId(product.id);
        setEditForm({
            name: product.name,
            category: product.category,
            description: product.description || ''
        });
    }
    
    function handleUpdateProduct(id){
        fetch(`http://localhost:5000/api/products/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(editForm),
        })
        .then((res) => res.json())
        .then((data) => {
            setEditingProductId(null);
            fetchProducts(); // Refresh the product list
        });
    
    }

    function startEditingVariant(variant){
        setEditingVariantId(variant.id);
        setVariantForm({
            measurement: variant.measurement,
            price: variant.price,
            stockQty: variant.stockQty
        });
    }

    function handleUpdateVariant(id){
        fetch(`http://localhost:5000/api/variants/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(variantForm),
        })
        .then((res) => res.json())
        .then(() => {
            setEditingVariantId(null);
            fetchProducts(); // Refresh the product list
        });
    }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-50 mb-4">Manage Products</h1>
      <div className="flex flex-col gap-4">
        {products.map((product) => (
  <div key={product.id} className="bg-slate-800 p-4 rounded-lg text-slate-50">
    {/**only the row whose ID matches the editingProductId */}
    {editingProductId === product.id ? (
      <div className="flex flex-col gap-2">
        <input
          className="border p-2 rounded text-black"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        />
        <input
          className="border p-2 rounded text-black"
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
        />
        <textarea
          className="border p-2 rounded text-black"
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
        />
        <div className="flex gap-2">
          <button onClick={() => handleUpdateProduct(product.id)} className="bg-green-700 px-3 py-1 rounded">
            Save
          </button>
          <button onClick={() => setEditingProductId(null)} className="bg-slate-600 px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="flex justify-between items-center">
        <span className="font-bold">{product.name} — {product.category}</span>
        <div className="flex gap-2">
          <button onClick={() => startEditing(product)} className="bg-blue-700 px-3 py-1 rounded text-sm">
            Edit
          </button>
          <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 px-3 py-1 rounded text-sm">
            Delete Product
          </button>
        </div>
      </div>
    )}

            <div className="mt-2 flex flex-col gap-1 pl-4">
  {product.variants.map((variant) => (
    <div key={variant.id} className="text-sm">
      {editingVariantId === variant.id ? (
        <div className="flex gap-2 items-center">
          <input
            className="border p-1 rounded text-black w-24"
            value={variantForm.measurement}
            onChange={(e) => setVariantForm({ ...variantForm, measurement: e.target.value })}
          />
          <input
            className="border p-1 rounded text-black w-20"
            type="number"
            value={variantForm.price}
            onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
          />
          <input
            className="border p-1 rounded text-black w-20"
            type="number"
            value={variantForm.stockQty}
            onChange={(e) => setVariantForm({ ...variantForm, stockQty: e.target.value })}
          />
          <button onClick={() => handleUpdateVariant(variant.id)} className="bg-green-700 px-2 py-1 rounded">
            Save
          </button>
          <button onClick={() => setEditingVariantId(null)} className="bg-slate-600 px-2 py-1 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span>{variant.measurement} — ${variant.price.toFixed(2)} — stock: {variant.stockQty}</span>
          <div className="flex gap-2">
            <button onClick={() => startEditingVariant(variant)} className="bg-blue-700 px-2 py-1 rounded">
              Edit
            </button>
            <button onClick={() => handleDeleteVariant(variant.id)} className="bg-red-700 px-2 py-1 rounded">
              Delete Variant
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
  );
}

export default AdminProducts;