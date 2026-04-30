const pool = require("../config/db");

// ✅ GET CART
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      return res.json([]);
    }

    const cartId = cart.rows[0].id;

    const items = await pool.query(
      `SELECT ci.id, p.name, p.price, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    res.json(items.rows);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { product_id, quantity } = req.body;

    // 🔒 VALIDATION
    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Missing product or quantity" });
    }

    if (quantity < 1) quantity = 1;

    // Check if cart exists
    let cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    let cartId;

    if (cart.rows.length === 0) {
      const newCart = await pool.query(
        "INSERT INTO cart (user_id) VALUES ($1) RETURNING *",
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cart.rows[0].id;
    }

    // Check if product already in cart
    const existingItem = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2",
        [quantity, existingItem.rows[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
        [cartId, product_id, quantity]
      );
    }

    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE QUANTITY
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id, quantity } = req.body;

    // 🔒 VALIDATION
    if (!item_id || !quantity) {
      return res.status(400).json({ message: "Missing item or quantity" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // 🔒 ENSURE USER OWNS ITEM
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2
       AND cart_id IN (
         SELECT id FROM cart WHERE user_id = $3
       )
       RETURNING *`,
      [quantity, item_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Item ID required" });
    }

    // 🔒 ENSURE USER OWNS ITEM
    const result = await pool.query(
      `DELETE FROM cart_items
       WHERE id = $1
       AND cart_id IN (
         SELECT id FROM cart WHERE user_id = $2
       )
       RETURNING *`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed successfully" });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};