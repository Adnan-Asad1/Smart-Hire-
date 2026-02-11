import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 Save decoded user info (e.g., userId) to req.user
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
