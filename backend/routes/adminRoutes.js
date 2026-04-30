const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 📊 ADMIN CONTROLLER
const {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  getAnalytics
} = require("../controllers/adminController");

// 🛒 PRODUCT CONTROLLER
const {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// 📦 ORDER CONTROLLER
const { updateOrderStatus } = require("../controllers/orderController");


// =======================
// 📊 ADMIN ROUTES
// =======================

router.get("/stats", auth, admin, getDashboardStats);
router.get("/orders", auth, admin, getAllOrders);
router.get("/users", auth, admin, getAllUsers);
router.put("/orders/:id", auth, admin, updateOrderStatus);
router.get("/analytics", auth, admin, getAnalytics);


// =======================
// 🛒 PRODUCT CRUD (ADMIN)
// =======================

router.get("/products", auth, admin, getAllProductsAdmin);
router.post("/products", auth, admin, createProduct);
router.put("/products/:id", auth, admin, updateProduct);
router.delete("/products/:id", auth, admin, deleteProduct);


module.exports = router;