const pool = require("../config/db");

// 📊 DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    console.log("🔥 STATS ROUTE HIT");

    const users = await pool.query("SELECT COUNT(*) FROM users");
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const orders = await pool.query("SELECT COUNT(*) FROM orders");
    const revenue = await pool.query("SELECT COALESCE(SUM(total), 0) FROM orders");

    const data = {
      users: Number(users.rows[0].count),
      products: Number(products.rows[0].count),
      orders: Number(orders.rows[0].count),
      revenue: Number(revenue.rows[0].coalesce)
    };

    console.log("✅ STATS DATA:", data);

    res.json(data);

  } catch (err) {
    console.error("❌ STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
// 📊 ANALYTICS (orders per day)
exports.getAnalytics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json(
      result.rows.map(row => ({
        date: row.date,
        orders: Number(row.orders),
        revenue: Number(row.revenue)
      }))
    );

  } catch (err) {
    console.error("❌ ANALYTICS ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
};

// 📦 ALL ORDERS (ADMIN VIEW)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(orders.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 👥 ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role FROM users"
    );

    res.json(users.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};