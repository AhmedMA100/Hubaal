const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // ✅ TRIM ONLY (NO lowercase)
    name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ CASE-SENSITIVE CHECK
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ TRIM ONLY (NO lowercase)
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("LOGIN ATTEMPT:", email);

    // ✅ CASE-SENSITIVE QUERY
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    console.log("USER FOUND:", user.rows);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    console.log("PASSWORD MATCH:", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.json({
  token,
  user: {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  }
});

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};