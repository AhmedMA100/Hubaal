import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image_url: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/admin/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`/admin/products/${editingId}`, form);
    } else {
      await API.post("/admin/products", form);
    }

    setForm({ name: "", price: "", category: "", image_url: "" });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await API.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <h2>Products</h2>

        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />

          <input placeholder="Price" value={form.price}
            onChange={e => setForm({...form, price: e.target.value})} />

          <input placeholder="Category" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})} />

          <input placeholder="Image URL" value={form.image_url}
            onChange={e => setForm({...form, image_url: e.target.value})} />

          <button className="btn btn-primary">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        <table className="table">
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.category}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;