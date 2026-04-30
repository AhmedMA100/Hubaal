module.exports = (req, res, next) => {
  // Make sure user exists (set by authMiddleware)
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Check admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};