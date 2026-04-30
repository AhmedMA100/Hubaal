const pool = require("../config/db");

// ✅ GET ALL PRODUCTS (ADMIN)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );
    res.json(products.rows);
  } catch (err) {
    console.error("GET ADMIN PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUBLIC: GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json(products.rows);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUBLIC: GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    res.json(product.rows[0]);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image_url } = req.body;

    const product = await pool.query(
      `INSERT INTO products (name, price, category, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, price, category, image_url]
    );

    res.json(product.rows[0]);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category, image_url } = req.body;

    const updated = await pool.query(
      `UPDATE products
       SET name=$1, price=$2, category=$3, image_url=$4
       WHERE id=$5
       RETURNING *`,
      [name, price, category, image_url, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};