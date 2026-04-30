import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [orders, setOrders] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get("/admin/stats");
        const analyticsRes = await API.get("/admin/analytics");
        const ordersRes = await API.get("/admin/orders"); // ✅ NEW

        setStats(statsRes.data);
        setAnalytics(analyticsRes.data || []);
        setOrders(ordersRes.data.slice(0, 5)); // latest 5
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h2>Dashboard</h2>
            <p className="subtitle">Overview of your store</p>
          </div>

          <Link to="/" className="btn">
            ← Back to Store
          </Link>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <Link to="/admin/users" className="stat-card">
            <FaUsers className="icon" />
            <h4>Users</h4>
            <p>{stats?.users || 0}</p>
          </Link>

          <Link to="/admin/products" className="stat-card">
            <FaBox className="icon" />
            <h4>Products</h4>
            <p>{stats?.products || 0}</p>
          </Link>

          <Link to="/admin/orders" className="stat-card">
            <FaShoppingCart className="icon" />
            <h4>Orders</h4>
            <p>{stats?.orders || 0}</p>
          </Link>

          <Link to="/admin/orders" className="stat-card">
            <FaDollarSign className="icon" />
            <h4>Revenue</h4>
            <p>${Number(stats?.revenue || 0).toFixed(2)}</p>
          </Link>
        </div>

        {/* CHART */}
        <div className="chart-card">
          <h3>Sales Overview</h3>

          {analytics.length === 0 ? (
            <p className="empty">No analytics data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className="table-card">
          <h3>Recent Orders</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user_name || "User"}</td>
                  <td>${order.total}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;