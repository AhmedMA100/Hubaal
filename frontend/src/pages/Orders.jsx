import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import "../App.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log("Error loading orders");
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        
        
      orders.map(order => (
  <div 
    key={order.id} 
    className="order-card"
    onClick={() => navigate(`/orders/${order.id}`)}
    style={{ cursor: "pointer" }}
  >
    <p>Order ID: {order.id}</p>
    <p>Total: ${order.total}</p>
    <p>Status: {order.status}</p>
  </div>
        ))
      )}
    </div>
  );
}

export default Orders;