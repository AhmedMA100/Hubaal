import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/admin/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <h2>Orders</h2>

        <table className="table">
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>${o.total}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                  >
                    <option>pending</option>
                    <option>processing</option>
                    <option>shipped</option>
                    <option>delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;