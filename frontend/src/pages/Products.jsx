import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Shop</h2>

      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.image_url} alt={p.name} />

            <h4>{p.name}</h4>
            <p>${p.price}</p>

            <Link to={`/product/${p.id}`}>
              <button className="btn btn-primary">View</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;