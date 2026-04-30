import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  const isAdmin = user?.role === "admin";

  // 🔥 detect login/register pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // ✅ FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        setCartCount(res.data.length);
      } catch {
        setCartCount(0);
      }
    };

    if (user) fetchCart();
  }, [user]);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCartCount(0);

    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Hubaal Store
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {isAdmin && <Link to="/admin">Admin</Link>}

        <Link to="/cart">Cart ({cartCount})</Link>

        {user ? (
          <div className="user-section">
            <span className="user-name">Hello, {user.name}</span>

            <button onClick={handleLogout} className="btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>

            {/* 🔥 hide Register on login/register pages */}
            {!isAuthPage && (
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;