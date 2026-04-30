import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      console.log(res.data);

      // ✅ SAVE TOKEN + USER (WITH ROLE)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ UPDATE APP STATE (NO REFRESH NEEDED)
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">

      {/* TOGGLE */}
      <div className="auth-toggle">
        <button className="active">Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>

      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      {/* OPTIONAL MESSAGE */}
      <p className="auth-switch">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#60a5fa" }}>
          Register now
        </span>
      </p>

    </div>
  );
}

export default Login;