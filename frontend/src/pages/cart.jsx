import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const navigate = useNavigate();
  const removeItem = async (id) => {
  try {
    await API.delete(`/cart/remove/${id}`);
    fetchCart();
  } catch (err) {
    console.error(err);
    alert("Error removing item");
  }
};

  const updateQuantity = async (id, quantity) => {
    try {
      await API.put("/cart/update", {
        item_id: id,
        quantity,
      });
      fetchCart();
    } catch (err) {
      alert("Error updating cart");
    }
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="cart-container">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <h4>{item.name}</h4>
              <p>${item.price}</p>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
              />

              <button onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout")}>
  Go to Checkout
</button>
        </div>
      )}
    </div>
  );
}

export default Cart;