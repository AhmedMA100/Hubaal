const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ ADD authMiddleware HERE
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🛒 Get cart
    const cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const cartId = cart.rows[0].id;

    const items = await pool.query(
      `SELECT p.name, p.price, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (items.rows.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // 🎯 Stripe format
    const line_items = items.rows.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 💳 Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
       metadata: {
    userId: userId.toString(),
    cartId: cartId.toString(),
  },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: err.message || "Payment failed" });
  }
});

module.exports = router;