const express = require("express");
const cors = require("cors");

const app = express();


// ✅ MUST come BEFORE routes
app.use(cors());
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());


// routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes"); // 🔥 ADD THIS
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); // 🔥 ADD THIS
app.use("/api/payment", paymentRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;