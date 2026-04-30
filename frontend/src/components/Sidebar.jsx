import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">Admin</h2>

      <nav>
        <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
          <LayoutDashboard size={18}/> Dashboard
        </Link>

        <Link to="/admin/products" className={location.pathname === "/admin/products" ? "active" : ""}>
          <Package size={18}/> Products
        </Link>

        <Link to="/admin/orders" className={location.pathname === "/admin/orders" ? "active" : ""}>
          <ShoppingCart size={18}/> Orders
        </Link>

        <Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>
          <Users size={18}/> Users
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;