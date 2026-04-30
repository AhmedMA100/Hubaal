const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Remove "Bearer "
    const parsedToken = token.split(" ")[1];

    const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    if (process.env.NODE_ENV === "development") {
  console.log("ADMIN CHECK:", req.user);
}


    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};