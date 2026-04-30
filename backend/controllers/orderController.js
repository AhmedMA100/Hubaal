const pool = require("../config/db");


// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart
    const cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartId = cart.rows[0].id;

    // Get cart items with prices
    const items = await pool.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (items.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let total = 0;
    items.rows.forEach(item => {
      total += item.price * item.quantity;
    });

    // Create order (✅ with status)
    const order = await pool.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *",
      [userId, total, "pending"]
    );

    const orderId = order.rows[0].id;

    // Insert order items
    for (let item of items.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await pool.query(
      "DELETE FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    res.json({
      message: "Order created successfully",
      order: order.rows[0],
      items: items.rows
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(orders.rows);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET ORDER DETAILS (SECURE)
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // 🔒 Only allow owner to access order
    const order = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get items
    const items = await pool.query(
      `SELECT oi.id, oi.quantity, oi.price, p.name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({
      order: order.rows[0],
      items: items.rows
    });

  } catch (err) {
    console.error("GET ORDER DETAILS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ UPDATE ORDER STATUS (ADMIN FEATURE)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order: updated.rows[0]
    });

  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};