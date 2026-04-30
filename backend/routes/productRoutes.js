const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ PUBLIC ROUTES
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// ✅ ADMIN ROUTES
router.get("/admin/all", authMiddleware, adminMiddleware, productController.getAllProductsAdmin);

router.post("/", authMiddleware, adminMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;