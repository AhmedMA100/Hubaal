import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import "../App.css";

function OrderDetails() {
  const { id } = useParams(); // order id from URL
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await API.get(`/orders/${id}`);

      setOrder(res.data.order);
      setItems(res.data.items);
    } catch (err) {
      console.log("Error loading order details");
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-details">
      <h2>Order #{order.id}</h2>

      <p>Total: ${order.total}</p>
      <p>Status: {order.status}</p>

      <h3>Items</h3>

      {items.map(item => (
        <div key={item.id} className="order-item">
          <p>{item.name}</p>
          <p>Qty: {item.quantity}</p>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;